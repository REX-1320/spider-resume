import { useState } from "react"

export default function AIExtras({
  page,
  setPage,
  callAI,
  form,
  setForm,
  glassCard,
  glassBase,
  glassBtn,
  glassInput,
  textPrimary,
  textSecondary,
  textMuted,
  theme,
  D
}) {

const [chatInput,setChatInput] = useState("")
const [chatMessages,setChatMessages] = useState([])

const [generatedTemplates,setGeneratedTemplates] = useState([])

const [coverLetter,setCoverLetter] = useState("")

const TEMPLATE_TYPES = [
"modern",
"minimal",
"premium",
"luxury",
"creative",
"startup",
"corporate",
"developer",
"designer",
"executive"
]

const JOB_PLATFORMS = [
{
name:"LinkedIn",
url:"https://linkedin.com/jobs",
pros:["Huge recruiter network","Direct recruiter messages","Easy apply"],
cons:["High competition"]
},
{
name:"Indeed",
url:"https://indeed.com",
pros:["Massive job database","Fast search"],
cons:["Duplicate listings"]
},
{
name:"Wellfound",
url:"https://wellfound.com",
pros:["Startup jobs","Direct founder contact"],
cons:["Limited corporate roles"]
},
{
name:"Naukri",
url:"https://naukri.com",
pros:["Best for Indian market","Large recruiter base"],
cons:["Spam recruiters sometimes"]
},
{
name:"Glassdoor",
url:"https://glassdoor.com",
pros:["Salary insights","Company reviews"],
cons:["Less startup jobs"]
}
]

/* ---------------- AI CHAT ---------------- */

if(page==="chat"){
return(

<div style={{maxWidth:"700px",margin:"0 auto",padding:"28px 16px"}}>

<div style={{...glassCard,padding:"24px"}}>

<h3 style={{color:textPrimary,marginBottom:"10px"}}>💬 AI Resume Chat</h3>

<p style={{fontSize:"13px",color:textSecondary,marginBottom:"10px"}}>
Describe yourself and AI will create resume content.
</p>

<textarea
rows={4}
value={chatInput}
onChange={(e)=>setChatInput(e.target.value)}
placeholder="Example: I am a python developer with django and react experience"
style={{
...glassInput,
width:"100%",
marginBottom:"12px"
}}
/>

<button
style={{...glassBtn,padding:"12px",width:"100%"}}
onClick={async()=>{

if(!chatInput) return

const res = await callAI(`
Convert this description into resume JSON.

Return JSON:
{
"name":"",
"summary":"",
"skills":""
}

Description:
${chatInput}
`)

try{

const parsed = JSON.parse(res)

setForm(prev=>({
...prev,
name:parsed.name || prev.name,
summary:parsed.summary || prev.summary,
skills:parsed.skills || prev.skills
}))

setChatMessages(m=>[...m,{user:chatInput,ai:"Added to resume"}])

setChatInput("")

}catch(e){

alert("AI parse error")

}

}}
>
Generate Resume From Description
</button>

</div>

</div>

)
}

/* ---------------- TEMPLATES ---------------- */

if(page==="templates"){
return(

<div style={{maxWidth:"900px",margin:"0 auto",padding:"28px 16px"}}>

<div style={{...glassCard,padding:"24px"}}>

<h3 style={{color:textPrimary}}>🎨 AI Resume Templates</h3>

<button
style={{...glassBtn,padding:"12px",marginTop:"10px"}}
onClick={async()=>{

const res = await callAI(`
Generate 20 resume template styles.

Return JSON array:
[
{name:"Modern Blue",type:"modern"},
{name:"Minimal White",type:"minimal"}
]
`)

try{

setGeneratedTemplates(JSON.parse(res))

}catch{

alert("Template generation failed")

}

}}
>
Generate 20 Templates
</button>

<div
style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",
gap:"12px",
marginTop:"20px"
}}
>

{generatedTemplates.map((t,i)=>(

<div
key={i}
style={{
...glassBase,
padding:"16px",
borderRadius:"12px"
}}
>

<p style={{fontWeight:"700"}}>{t.name}</p>
<p style={{fontSize:"12px",color:textMuted}}>{t.type}</p>

</div>

))}

</div>

{generatedTemplates.length>0 && (

<button
style={{
...glassBtn,
marginTop:"20px",
padding:"12px",
width:"100%"
}}
onClick={()=>setGeneratedTemplates([])}
>
Generate New 20 Templates
</button>

)}

</div>

</div>

)
}

/* ---------------- JOB PLATFORMS ---------------- */

if(page==="jobs"){
return(

<div style={{maxWidth:"700px",margin:"0 auto",padding:"28px 16px"}}>

<div style={{...glassCard,padding:"24px"}}>

<h3 style={{color:textPrimary}}>🔎 Job Platforms</h3>

{JOB_PLATFORMS.map((p,i)=>(

<div
key={i}
style={{
...glassBase,
padding:"16px",
borderRadius:"12px",
marginBottom:"12px"
}}
>

<a
href={p.url}
target="_blank"
rel="noreferrer"
style={{fontWeight:"700",color:textPrimary}}
>
{p.name}
</a>

<p style={{fontSize:"12px",color:textMuted}}>Pros</p>

<ul>
{p.pros.map((x,j)=><li key={j}>{x}</li>)}
</ul>

<p style={{fontSize:"12px",color:textMuted}}>Cons</p>

<ul>
{p.cons.map((x,j)=><li key={j}>{x}</li>)}
</ul>

</div>

))}

</div>

</div>

)
}

/* ---------------- COVER LETTER ---------------- */

if(page==="cover"){
return(

<div style={{maxWidth:"700px",margin:"0 auto",padding:"28px 16px"}}>

<div style={{...glassCard,padding:"24px"}}>

<h3 style={{color:textPrimary}}>📄 Cover Letter Generator</h3>

<button
style={{...glassBtn,padding:"12px",marginTop:"10px"}}
onClick={async()=>{

const res = await callAI(`
Write a professional cover letter based on this resume:

${JSON.stringify(form)}
`)

setCoverLetter(res)

}}
>
Generate Cover Letter
</button>

{coverLetter && (

<textarea
rows={12}
value={coverLetter}
readOnly
style={{
...glassInput,
marginTop:"14px",
width:"100%"
}}
/>

)}

</div>

</div>

)
}

return null

}