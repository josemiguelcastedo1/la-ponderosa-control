import { useState, useCallback } from "react";

const T={bg:"#0B0E0C",surface:"#111512",card:"#161A17",border:"#222926",green:"#52C97A",greenDim:"#1E4A2E",greenGlow:"rgba(82,201,122,0.12)",gold:"#D4A84B",red:"#E05555",redDim:"rgba(224,85,85,0.1)",text:"#EDF2EE",textSub:"#7A9480",textMuted:"#3D5040"};
const WORKERS=["Jose","Ruben","Fernando","Miguel Torres","Vaquero 1","Vaquero 2","Vaquero 3","Vaquero 4","Diarista 1","Diarista 2"];
const uid=()=>Math.random().toString(36).slice(2,10);
const fmtD=d=>{try{return new Date(d+"T12:00").toLocaleDateString("es-BO",{day:"2-digit",month:"long",year:"numeric"});}catch{return d||"";}};
const today=()=>new Date().toISOString().slice(0,10);

function useLS(key,init){const[data,set]=useState(()=>{try{const s=localStorage.getItem("lp_rep_"+key);return s?JSON.parse(s):init;}catch{return init;}});const save=useCallback(val=>{const next=typeof val==="function"?val(data):val;set(next);try{localStorage.setItem("lp_rep_"+key,JSON.stringify(next));}catch{};},[data,key]);return[data,save];}

function Btn({children,onClick,v="primary",sz="md",full,disabled}){const[h,sh]=useState(false);const p={xs:"5px 10px",sm:"7px 14px",md:"10px 18px"}[sz]||"10px 18px";const fs={xs:10,sm:11,md:13}[sz]||13;const vs={primary:{background:h?"#63D98A":T.green,color:"#091A10"},danger:{background:h?"#E86666":T.red,color:"#fff"},ghost:{background:h?T.border:"transparent",color:T.textSub,border:`1px solid ${T.border}`},warn:{background:h?"rgba(224,85,85,0.2)":T.redDim,color:T.red,border:`1px solid rgba(224,85,85,0.3)`}};return<button style={{padding:p,fontSize:fs,fontWeight:600,borderRadius:10,border:"none",cursor:disabled?"not-allowed":"pointer",display:"inline-flex",alignItems:"center",gap:5,transition:"all 0.15s",width:full?"100%":"auto",justifyContent:full?"center":"flex-start",opacity:disabled?0.5:1,fontFamily:"inherit",...vs[v]}} onClick={onClick} disabled={disabled} onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)}>{children}</button>;}

function Inp({label,value,onChange,type="text",placeholder,required,options,rows}){const s={background:"#0D1210",border:`1px solid ${T.border}`,borderRadius:10,padding:"11px 14px",color:T.text,fontSize:13,width:"100%",outline:"none",fontFamily:"inherit",boxSizing:"border-box"};return<div>{label&&<label style={{fontSize:11,fontWeight:700,color:T.textSub,marginBottom:5,display:"block",textTransform:"uppercase",letterSpacing:"0.6px"}}>{label}{required&&<span style={{color:T.red}}> *</span>}</label>}{options?<select style={s} value={value||""} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o.v!=null?o.v:o} value={o.v!=null?o.v:o}>{o.l!=null?o.l:o}</option>)}</select>:rows?<textarea style={{...s,minHeight:rows*26,resize:"vertical"}} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>:<input style={s} type={type} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>}</div>;}

function Modal({title,onClose,children}){return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}><div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:"20px 20px 0 0",padding:"24px 20px 32px",width:"100%",maxWidth:600,maxHeight:"94vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div style={{fontSize:17,fontWeight:700}}>{title}</div><button onClick={onClose} style={{background:T.border,border:"none",borderRadius:8,width:30,height:30,cursor:"pointer",color:T.textSub,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button></div>{children}</div></div>;}

function G2({children,gap=12}){return<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap}}>{children}</div>;}

export default function ReportesLP(){
  const[reportes,setReportes]=useLS("reportes_v2",[]);
  const[showNew,sNew]=useState(false);
  const[editando,setEditando]=useState(null);
  const[eliminando,setEliminando]=useState(null);
  const[verDetalle,setVerDetalle]=useState(null);
  const[q,setQ]=useState("");
  const blank={fecha:today(),autor:WORKERS[0],texto:""};
  const[form,setForm]=useState(blank);
  const f=k=>v=>setForm(p=>({...p,[k]:v}));
  const abrir=(r=null)=>{setEditando(r);setForm(r?{...r}:blank);sNew(true);};
  const cerrar=()=>{sNew(false);setEditando(null);setForm(blank);};
  const guardar=()=>{if(!form.fecha||!form.texto.trim())return alert("Completá la fecha y el reporte");if(editando){setReportes(rs=>rs.map(r=>r.id===editando.id?{...form,id:editando.id}:r));}else{setReportes(rs=>[{...form,id:uid(),cAt:new Date().toISOString()},...rs]);}cerrar();};
  const eliminar=()=>{setReportes(rs=>rs.filter(r=>r.id!==eliminando.id));setEliminando(null);};
  const filtrados=reportes.filter(r=>!q||r.fecha.includes(q)||r.autor?.toLowerCase().includes(q.toLowerCase())||r.texto?.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>b.fecha>a.fecha?1:-1);

  return<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
      <div><div style={{fontSize:20,fontWeight:800,color:T.text}}>Reportes 📝</div><div style={{fontSize:12,color:T.textSub,marginTop:2}}>{reportes.length} reportes registrados</div></div>
      <Btn onClick={()=>abrir()}>+ Nuevo Reporte</Btn>
    </div>
    <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍 Buscar por fecha, autor o contenido..." style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"11px 14px",color:T.text,fontSize:13,width:"100%",outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:16}}/>
    {filtrados.length===0&&<div style={{textAlign:"center",padding:"48px 20px",color:T.textMuted}}><div style={{fontSize:36,marginBottom:10}}>📝</div><div style={{fontSize:13}}>No hay reportes registrados</div></div>}
    {filtrados.map(r=><div key={r.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"18px",borderLeft:`3px solid ${T.green}`,marginBottom:12}}>
      <div style={{marginBottom:10}}>
        <div style={{fontWeight:700,fontSize:15,color:T.green}}>📅 {fmtD(r.fecha)}</div>
        <div style={{fontSize:12,color:T.textSub,marginTop:2}}>👤 {r.autor}</div>
      </div>
      <div style={{fontSize:13,color:T.text,lineHeight:1.7,marginBottom:12,whiteSpace:"pre-wrap",maxHeight:80,overflow:"hidden"}}>{r.texto}</div>
      <div style={{display:"flex",gap:6,paddingTop:10,borderTop:`1px solid ${T.border}`}}>
        <Btn v="ghost" sz="xs" onClick={()=>setVerDetalle(r)}>👁 Ver completo</Btn>
        <Btn v="ghost" sz="xs" onClick={()=>abrir(r)}>✏️ Editar</Btn>
        <Btn v="warn" sz="xs" onClick={()=>setEliminando(r)}>🗑️ Eliminar</Btn>
      </div>
    </div>)}

    {verDetalle&&<Modal title={`Reporte — ${fmtD(verDetalle.fecha)}`} onClose={()=>setVerDetalle(null)}>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div style={{fontSize:12,color:T.textSub}}>👤 {verDetalle.autor}</div>
        <div style={{fontSize:14,color:T.text,lineHeight:1.8,whiteSpace:"pre-wrap",background:T.bg,padding:"16px",borderRadius:10,border:`1px solid ${T.border}`}}>{verDetalle.texto}</div>
        <Btn v="ghost" full onClick={()=>setVerDetalle(null)}>Cerrar</Btn>
      </div>
    </Modal>}

    {showNew&&<Modal title={editando?"Editar Reporte":"Nuevo Reporte"} onClose={cerrar}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <G2>
          <Inp label="Fecha" required type="date" value={form.fecha} onChange={f("fecha")}/>
          <Inp label="Autor" value={form.autor} onChange={f("autor")} options={WORKERS}/>
        </G2>
        <Inp label="Reporte" required value={form.texto} onChange={f("texto")} placeholder="Escribí acá lo que pasó, novedades del día, observaciones..." rows={8}/>
        <G2><Btn v="ghost" full onClick={cerrar}>Cancelar</Btn><Btn full onClick={guardar}>{editando?"Guardar Cambios":"Guardar Reporte"}</Btn></G2>
      </div>
    </Modal>}

    {eliminando&&<Modal title="¿Eliminar reporte?" onClose={()=>setEliminando(null)}>
      <div style={{fontSize:14,color:T.textSub,marginBottom:20}}>¿Eliminar el reporte del {fmtD(eliminando.fecha)}?</div>
      <G2><Btn v="ghost" full onClick={()=>setEliminando(null)}>Cancelar</Btn><Btn v="danger" full onClick={eliminar}>Eliminar</Btn></G2>
    </Modal>}
  </div>;
}
