import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=n=>JSON.parse(fs.readFileSync(path.join(root,'data',n+'.json'),'utf8'));
const rows=read('workbook-import'),tools=read('tools');
const text=v=>String(v??'').trim();
const parts=v=>text(v).split(/;\s*|\n+/).map(s=>s.trim()).filter(Boolean);
const key=v=>text(v).toLowerCase().replace(/[^a-z0-9]/g,'');
const aliases={'gemininotebooknotebooklm':'gemininotebook'};
const report={imported:[],pending:[],sourceDates:0,missingCurrencies:[],restrictedFreeAccess:[],notes:[]};
function url(v){const s=text(v).match(/https?:\/\/[^\s;]+/)?.[0];if(!s)throw Error('Missing URL: '+v);const u=new URL(s);if(u.protocol!=='https:')throw Error('HTTPS required: '+s);return u.href;}
function freeAccess(value,name){
 const s=text(value);
 if(['Duolingo Max','Notion AI','ClickUp Brain','Writesonic'].includes(name))return false;
 if(/no (?:true |permanent )?free plan|no permanent free|not included|rather than a permanent|not a recurring|no free downloads|downloads require payment/i.test(s))return false;
 if(/historically|verify|limited free access|verified US teachers/i.test(s))return null;
 return /^yes\b|entire product is free/i.test(s)?true:/^no\b/i.test(s)?false:null;
}
const seen=new Set();
for(const [i,r]of rows.entries()){
 const original=text(r['AI Tool Name']);const k=aliases[key(original)]||key(original);
 const t=tools.find(t=>key(t.name)===k||key(t.submission?.name)===k);if(!t)throw Error('Unmatched workbook tool: '+original);
 if(seen.has(t.slug))throw Error('Duplicate workbook row '+original);seen.add(t.slug);
 const sourceDate=text(r['Verification Status']).match(/\d{4}-\d{2}-\d{2}/)?.[0]||null;
 const free=freeAccess(r['Free Plan'],t.name);
 if(free!==true&&/^yes/i.test(text(r['Free Plan'])))report.restrictedFreeAccess.push(t.name);
 const trialText=text(r['Free Trial']);const trial=/^yes\b/i.test(trialText)?true:/^no\b|free tier serves|free tier is the trial/i.test(trialText)?false:null;
 const apiText=text(r['API']);const api=/^yes\b/i.test(apiText)?'yes':/^no\b/i.test(apiText)?'no':'unknown';
 const summary=text(r['Overview']).split(/(?<=[.!?])\s+/)[0];
 Object.assign(t,{status:'published',vendor:text(r.Vendor),shortDescription:summary.length>220?summary.slice(0,217).replace(/\s+\S*$/,'')+'…':summary,description:text(r.Overview),officialUrl:url(r['Official Website']),features:parts(r['Main Features']),audiences:[text(r['Intended Audience'])],useCases:parts(r['Use Cases']),bestFor:text(r['Best For']),platforms:parts(r.Platforms),languages:[text(r.Languages)],integrations:parts(r.Integrations),advantages:parts(r.Advantages),limitations:parts(r.Limitations),api:{availability:api,notes:apiText,url:''},lastVerified:null,contentUpdated:'2026-09-13',featured:false,popularityEvidence:null,
 pricing:{model:/freemium|free with paid/i.test(text(r['Pricing Model']))?'Freemium':/subscription/i.test(text(r['Pricing Model']))?'Subscription':/free/i.test(text(r['Pricing Model']))?'Free access':/credit|usage|pay.as.you.go/i.test(text(r['Pricing Model']))?'Usage-based':'See pricing',modelDetails:text(r['Pricing Model']),freePlan:free,freeTrial:trial,freePlanNotes:text(r['Free Plan']),freeTrialNotes:trialText,startingPrice:null,currency:r.Currency?text(r.Currency):null,billingPeriod:text(r['Billing Period'])||null,notes:text(r['Pricing Plans']),usageLimits:text(r['Usage Limits']),url:url(r['Pricing URL'])},
 testing:{method:'Research summary supplied by the directory editor; not a hands-on test.',notes:text(r['Evaluation / Testing Notes'])},
 contentSource:{file:'AI_Tools_Directory.xlsx',sheet:'AI Tools',row:i+2,imported:'2026-09-13',verificationLabel:text(r['Verification Status'])||null,sourceVerificationDate:sourceDate,evidence:text(r['Evidence / Sources']),logoSource:text(r['Logo Source']),reuseNotes:text(r['Screenshot / Reuse Information'])},
 sources:[{label:'Official product website',url:url(r['Official Website'])},{label:'Official pricing',url:url(r['Pricing URL'])}],
 seoTitle:`${t.name}: Features, Pricing & Use Cases | AI Directory`,metaDescription:`Explore ${t.name}: ${text(r['Best For']).replace(/\.$/,'')}. Compare features, pricing, limits and integrations.`,
 });
 // Preserve restrictions; a free parent product is not a free plan for its paid AI feature.
 if(t.name==='Duolingo Max')t.pricing.freePlanNotes='The core Duolingo course has free access; this does not establish a free plan for Duolingo Max. '+t.pricing.freePlanNotes;
 if(t.name==='Notion AI')t.pricing.freePlanNotes='The free workspace includes an AI trial allowance, rather than confirmed ongoing free AI access. '+t.pricing.freePlanNotes;
 if(t.slug==='gemini-notebook'){
  t.name='Gemini Notebook (NotebookLM)';t.submission.identityNeedsConfirmation=false;
  t.description='Google’s source-based research and note-taking tool brings uploaded documents and discovered sources into a notebook. It supports cited answers, summaries and other formats for exploring a collection of material.';
  t.features=['Add documents and other supported sources to a notebook','Ask questions with citations to notebook material','Discover sources from the web or Google Drive','Use research workflows to gather additional sources','Create summaries and audio overviews of notebook material'];
  t.advantages=['Source citations help readers trace answers to the underlying material','Multiple output formats support different ways of exploring documents','Web source discovery can expand the material in a notebook'];
  t.limitations=['Answers still need to be checked against the original sources','Source counts, file sizes and usage limits depend on the plan','Check account-specific data policies before using confidential material'];
  t.testing.notes='The workbook’s claim that this tool cannot search the web was corrected using Google’s source-discovery documentation. Source grounding should not be treated as a guarantee of accuracy or suitability for regulated data.';
  t.sources.push({label:'Google: add or discover sources',url:'https://support.google.com/gemininotebook/answer/16215270'});
  t.seoTitle='Gemini Notebook (NotebookLM): Features & Use Cases | AI Directory';
  report.notes.push('Matched Gemini Notebook (NotebookLM) to the existing gemini-notebook slug. Corrected the no-web-search claim and removed absolute accuracy/safety claims.');
 }
 // Do not reproduce legal conclusions or broad assurances of licensing safety without a separate review.
 if(['Suno','Udio'].includes(t.name)){
  t.limitations=t.limitations.filter(v=>!/(litigation|lawsuit|legal uncertainty|record labels|copyright)/i.test(v));
  t.limitations.push('Review the current usage terms for your plan and intended use before distributing generated music.');
  t.testing.notes='The source includes legal and licensing commentary that has not been independently assessed here. Refer to the current official terms for plan-specific usage conditions.';
  t.useCases=t.useCases.map(v=>v.replace('without licensing','for a project, subject to applicable usage terms'));
  report.notes.push(t.name+': omitted unverified legal conclusions; original wording remains in the source workbook.');
 }
 if(sourceDate)report.sourceDates++;if(!r.Currency)report.missingCurrencies.push(t.name);
 t.faqs=[{question:`What is ${t.name} best for?`,answer:t.bestFor},{question:`What free access does ${t.name} offer?`,answer:t.pricing.freePlanNotes},{question:`What limits should I check before using ${t.name}?`,answer:t.pricing.usageLimits},{question:`Does ${t.name} provide an API?`,answer:t.api.notes}];
 report.imported.push(t.name);
}
for(const t of tools){if(!seen.has(t.slug))report.pending.push(t.name);}
fs.writeFileSync(path.join(root,'data/tools.json'),JSON.stringify(tools,null,2)+'\n');
fs.writeFileSync(path.join(root,'docs/WORKBOOK-IMPORT-REPORT.md'),`# Workbook content import\n\nImported ${report.imported.length} existing tools from AI_Tools_Directory.xlsx, sheet AI Tools, rows 2–86. ${report.pending.length} entries are absent from the workbook and remain pending. No existing tool was removed.\n\n${report.sourceDates} rows contain a source verification date. These dates are attributed to the workbook and do not represent independent verification of all claims by this directory. ${report.missingCurrencies.length} rows omit a currency; no numeric Offer or currency is invented.\n\n## Editorial corrections\n\n${report.notes.map(s=>'- '+s).join('\n')}\n\n## Free-access restrictions\n\nFree parent-product access, one-time trials and preview-only access are not automatically treated as a permanent free AI plan. Full source notes remain visible on each profile. Restricted Yes entries: ${report.restrictedFreeAccess.join(', ')}.\n\n## Still pending\n\n${report.pending.map(s=>'- '+s).join('\n')}\n\n## Media\n\nLogo-source links and reuse notes are preserved in the content records. They are not treated as permissions or direct image URLs. No unlicensed screenshots or external placeholder images were added.\n`);
console.log(JSON.stringify({enriched:report.imported.length,pending:report.pending.length,datedSourceRows:report.sourceDates,freePlan:tools.filter(t=>t.pricing.freePlan===true).length}));
