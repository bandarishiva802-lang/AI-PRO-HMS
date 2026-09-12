import React, { useMemo, useState } from 'react';
import { CheckCircle2, CreditCard, Minus, Plus, Receipt, Search, Trash2 } from 'lucide-react';
import './pharmacy.css';

type RxLine={medicine:string;dose:string;frequency:string;qty:number;price:number};
const catalog=[
 {medicine:'CORDAPA-10 TABLET',batch:'LGP10/116/07',stock:110,price:149.06},
 {medicine:'ALLEGRO-M',batch:'T6A5383',stock:62,price:119},
 {medicine:'GLIMICOR-M4 FORTE',batch:'BD252710',stock:18,price:186.56},
 {medicine:'MYLINCOR-PLUS',batch:'BH62106',stock:8,price:258}
];

export default function PharmacyBilling(){
 const [lines,setLines]=useState<RxLine[]>([]);
 const [patient,setPatient]=useState('Ravi Kumar — P-10021');
 const [search,setSearch]=useState('');
 const [paid,setPaid]=useState(false);
 const results=useMemo(()=>catalog.filter(x=>x.medicine.toLowerCase().includes(search.toLowerCase())).slice(0,6),[search]);
 const add=(m:typeof catalog[number])=>setLines(v=>{const i=v.findIndex(x=>x.medicine===m.medicine);if(i>=0)return v.map((x,n)=>n===i?{...x,qty:Math.min(x.qty+1,m.stock)}:x);return [...v,{medicine:m.medicine,dose:'1 tab',frequency:'OD',qty:1,price:m.price}]});
 const subtotal=lines.reduce((s,x)=>s+x.qty*x.price,0); const gst=subtotal*.05; const total=subtotal+gst;
 const changeQty=(i:number,d:number)=>setLines(v=>v.map((x,n)=>n===i?{...x,qty:Math.max(1,x.qty+d)}:x));
 return <section className="pharmacyBilling content">
  <div className="pageActions"><div><h2>Prescription → Pharmacy Billing</h2><p>Convert a saved prescription into a medicine bill and deduct stock after payment.</p></div><span className="flowBadge">EMR → Pharmacy → Billing</span></div>
  <div className="billingGrid">
   <div className="panel">
    <div className="sectionHead"><div><h3>Patient & medicines</h3><p>Choose the patient and add prescribed medicines.</p></div></div>
    <div className="form"><label>Patient<select value={patient} onChange={e=>setPatient(e.target.value)}><option>Ravi Kumar — P-10021</option><option>S. Lakshmi — P-10020</option><option>Anitha Reddy — P-10018</option></select></label>
     <label>Search medicine<div className="medicineSearch"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Type medicine name..."/></div></label>
    </div>
    {search&&<div className="medicineResults">{results.map(m=><button key={m.medicine} onClick={()=>{add(m);setSearch('')}}><span><strong>{m.medicine}</strong><small>Batch {m.batch} · Stock {m.stock}</small></span><b>₹{m.price.toFixed(2)}</b></button>)}</div>}
    <div className="rxBillList">{lines.length===0?<div className="billEmpty"><Receipt size={28}/><strong>No medicines added</strong><span>Search above or use the prescription items.</span></div>:lines.map((x,i)=><div className="billLine" key={x.medicine}><div><strong>{x.medicine}</strong><small>{x.dose} · {x.frequency} · ₹{x.price.toFixed(2)} each</small></div><div className="qty"><button onClick={()=>changeQty(i,-1)}><Minus size={14}/></button><b>{x.qty}</b><button onClick={()=>changeQty(i,1)}><Plus size={14}/></button></div><strong>₹{(x.qty*x.price).toFixed(2)}</strong><button className="deleteLine" onClick={()=>setLines(v=>v.filter((_,n)=>n!==i))}><Trash2 size={15}/></button></div>)}</div>
   </div>
   <div className="panel billSummary"><div className="sectionHead"><div><h3>Medicine bill</h3><p>{patient}</p></div></div><div className="summaryRows"><div><span>Subtotal</span><strong>₹{subtotal.toFixed(2)}</strong></div><div><span>GST (5%)</span><strong>₹{gst.toFixed(2)}</strong></div><div className="grand"><span>Total</span><strong>₹{total.toFixed(2)}</strong></div></div><label>Payment method<select><option>Cash</option><option>UPI</option><option>Card</option></select></label><button className="primary full" disabled={!lines.length||paid} onClick={()=>setPaid(true)}>{paid?<><CheckCircle2 size={17}/> Paid & stock deduction queued</>:<><CreditCard size={17}/> Collect ₹{total.toFixed(2)}</>}</button>{paid&&<div className="successBox"><CheckCircle2 size={18}/><div><strong>Billing complete</strong><span>Invoice generated. Stock deduction is recorded as a pending inventory transaction.</span></div></div>}</div>
  </div>
  <div className="panel workflowNote"><strong>Safety checkpoint</strong><span>Stock is not silently changed. The production version will require pharmacy confirmation before final batch-wise deduction.</span></div>
 </section>
}
