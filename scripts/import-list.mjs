// Import submitted name/category rows as unverified catalog entries, never invented reviews.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=process.argv[2];if(!file)throw Error('Pass the path to a Markdown tool table.');
const read=n=>JSON.parse(fs.readFileSync(path.join(root,'data',n+'.json'),'utf8'));
const cats=read('categories'),tools=read('tools'),template=read('tool-template');
const newCats=[
 ['ai-assistants','AI Assistants','◎','Explore general-purpose help across everyday tasks.','Compare supported tasks, app access, permissions, and the level of control you retain.'],
 ['ai-coding-agents','AI Coding Agents','⌘','Explore tools designed to carry out software development tasks.','Check review steps, execution permissions, supported environments, and testing workflows.'],
 ['ai-website-builders','AI Website Builders','▦','Explore tools for creating websites with AI assistance.','Compare editing controls, code export, hosting requirements, accessibility, and ongoing costs.'],
 ['ai-customer-support','AI Customer Support','◇','Explore AI tools for customer questions and support workflows.','Review knowledge-source controls, human handoff, integrations, and the treatment of customer data.'],
 ['ai-meeting-assistants','AI Meeting Assistants','▤','Explore tools for recording, transcribing, and summarizing meetings.','Compare meeting-platform support, consent controls, transcript languages, and data retention.'],
 ['ai-agents','AI Agents','⇄','Explore tools that coordinate and perform tasks across workflows.','Check action permissions, approval steps, audit trails, and recovery when a task fails.']
];
for(const [slug,name,icon,description,guidance]of newCats)if(!cats.some(c=>c.slug===slug))cats.push({slug,name,icon,description,guidance});
const map={
 'AI Chatbot':'ai-chatbots','AI Assistant':'ai-assistants','AI Search Engine':'ai-search-engines','AI Search':'ai-search-engines',
 'AI Research Tool':'ai-research-tools','AI Research':'ai-research-tools','AI Education Tool':'ai-education-tools','AI Translation Tool':'ai-translation-tools',
 'AI Writing Tool':'ai-writing-tools','AI Coding Assistant':'ai-coding-assistants','AI Coding Agent':'ai-coding-agents','AI Productivity Tool':'ai-productivity-tools','AI Productivity':'ai-productivity-tools',
 'AI Automation Tool':'ai-automation-tools','AI Image Generator':'ai-image-generators','AI Video Generator':'ai-video-generators','AI Voice Generator':'ai-voice-generators',
 'AI Music Tool':'ai-audio-and-music-tools','AI Audio':'ai-audio-and-music-tools','AI Presentation Tool':'ai-presentation-tools','AI Design Tool':'ai-design-tools','AI Design':'ai-design-tools',
 'AI Marketing Tool':'ai-marketing-tools','AI Marketing':'ai-marketing-tools','AI SEO Tool':'ai-seo-tools','AI SEO':'ai-seo-tools','AI Website Builder':'ai-website-builders',
 'AI Data Analysis Tool':'ai-data-analysis-tools','AI Customer Support':'ai-customer-support','Customer Support':'ai-customer-support','AI Meeting Assistant':'ai-meeting-assistants','AI Agent':'ai-agents','AI Agents':'ai-agents'
};
const rows=fs.readFileSync(file,'utf8').split(/\r?\n/).filter(l=>l.startsWith('|')).slice(2).map(l=>l.split('|').slice(1,-1).map(v=>v.trim()));
const seen=new Set(),newLabels=new Set();let added=0;
for(const [name,main,secondary]of rows){
 if(!name||!map[main])throw Error('Unmapped main category: '+main);
 const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 if(seen.has(slug))throw Error('Duplicate input: '+name);seen.add(slug);
 if(!map[secondary])newLabels.add(secondary);
 if(tools.some(t=>t.slug===slug))continue;
 tools.push({...structuredClone(template),slug,name,status:'draft',primaryCategory:map[main],categories:[...new Set([map[main],map[secondary]].filter(Boolean))],subcategories:[secondary],tags:[main,secondary],dateAdded:'2026-09-12',submission:{name,mainCategory:main,secondaryCategory:secondary,source:'User-provided list',identityNeedsConfirmation:name==='Gemini Notebook'}});added++;
}
fs.writeFileSync(path.join(root,'data/categories.json'),JSON.stringify(cats,null,2)+'\n');
fs.writeFileSync(path.join(root,'data/tools.json'),JSON.stringify(tools,null,2)+'\n');
fs.writeFileSync(path.join(root,'docs/CATEGORY-MAPPING.md'),'# Submitted category mapping\n\n'+rows.length+' submitted tools. Names and category assignments are supplied by the user and are not independently verified.\n\n## New top-level categories\n\n'+newCats.map(c=>'- '+c[1]).join('\n')+'\n\n## Secondary labels retained as subcategories (no separate pages)\n\n'+[...newLabels].sort().map(s=>'- '+s).join('\n')+'\n\n## Normalization\n\nSingular labels map to the existing plural categories. AI Music Tool and AI Audio map to AI Audio & Music Tools. AI Agent and AI Agents share AI Agents. Other recognized secondary labels also add membership in the corresponding main category.\n\nGemini Notebook retains its submitted name pending confirmation of whether NotebookLM was intended.\n');
console.log(`Imported ${added} draft entries; ${tools.length} total tools; ${cats.length} categories.`);
