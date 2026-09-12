import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, Bell, CalendarDays, ChevronRight, FlaskConical, LayoutDashboard, Menu, Package, Pill, Plus, Search, Settings, ShoppingCart, Stethoscope, UserRound, Users, X } from 'lucide-react';
import './styles.css';

type Patient = { id: string; name: string; age: number; phone: string; lastVisit: string; status: string };

type Medicine = { name: string; batch: string; expiry: string; stock: number; mrp: number };

const patients: Patient[] = [
  { id: 'P-10021', name: 'Ravi Kumar', age: 48, phone: '98•••••210', lastVisit: '12 Sep 2026', status: 'OPD' },
  { id: 'P-10020', name: 'S. Lakshmi', age: 35, phone: '97•••••641', lastVisit: '12 Sep 2026', status: 'Lab' },
  { id: 'P-10019', name: 'Mohammed Imran', age: 61, phone: '99•••••812', lastVisit: '11 Sep 2026', status: 'IPD' },
  { id: 'P-10018', name: 'Anitha Reddy', age: 29, phone: '96•••••308', lastVisit: '11 Sep 2026', status: 'Completed' },
];

const medicines: Medicine[] = [
  { name: 'CORDAPA-10 TABLET', batch: 'LGP10/116/07', expiry: '09/2027', stock: 110, mrp: 149.06 },
  { name: 'ALLEGRO-M', batch: 'T6A5383', expiry: '04/2028', stock: 62, mrp: 119 },
  { name: 'GLIMICOR-M4 FORTE', batch: 'BD252710', expiry: '10/2027', stock: 18, mrp: 186.56 },
  { name: 'MYLINCOR-PLUS', batch: 'BH62106', expiry: '04/2027', stock: 8, mrp: 258 },
];

const nav = [
  ['Dashboard', LayoutDashboard], ['Patients', Users], ['OPD', Stethoscope], ['IPD & Beds', Activity], ['Laboratory', FlaskConical], ['Pharmacy', Pill], ['Billing', ShoppingCart], ['WhatsApp & AI PRO', Bell]
] as const;

function App() {
  const [active, setActive] = useState('Dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPatient, setShowPatient] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [query, setQuery] = useState('');
  const filteredPatients = useMemo(() => patients.filter(p => `${p.name} ${p.id}`.toLowerCase().includes(query.toLowerCase())), [query]);

  return <div className="app">
    <aside className={menuOpen ? 'sidebar open' : 'sidebar'}>
      <div className="brand"><div className="brandMark">AI</div><div><strong>AI PRO</strong><span>Hospital OS</span></div><button className="mobileClose" onClick={() => setMenuOpen(false)}><X size={20}/></button></div>
      <div className="hospital"><div className="hospitalIcon">🏥</div><div><strong>Lakshmi Narasimha</strong><span>Hospital</span></div></div>
      <nav>{nav.map(([label, Icon]) => <button key={label} className={active === label ? 'navItem active' : 'navItem'} onClick={() => {setActive(label);setMenuOpen(false)}}><Icon size={19}/><span>{label}</span>{label === 'WhatsApp & AI PRO' && <i>AI</i>}</button>)}</nav>
      <div className="sidebarBottom"><button className="navItem"><Settings size={19}/><span>Settings</span></button><div className="user"><div className="avatar">DR</div><div><strong>Hospital Admin</strong><span>Administrator</span></div></div></div>
    </aside>

    <main className="main">
      <header className="topbar"><button className="hamburger" onClick={() => setMenuOpen(true)}><Menu/></button><div className="pageTitle"><span>Good afternoon</span><h1>{active}</h1></div><div className="topActions"><div className="search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search patient, medicine..."/></div><button className="iconBtn"><Bell size={19}/><b></b></button><div className="topAvatar">DR</div></div></header>

      {active === 'Dashboard' && <Dashboard onNewPatient={()=>setShowPatient(true)} onScan={()=>setShowScan(true)}/>} 
      {active === 'Patients' && <Patients onNew={()=>setShowPatient(true)} patients={filteredPatients}/>} 
      {active === 'Pharmacy' && <Pharmacy onScan={()=>setShowScan(true)}/>} 
      {active !== 'Dashboard' && active !== 'Patients' && active !== 'Pharmacy' && <Placeholder title={active}/>} 
    </main>

    {showPatient && <Modal title="Register New Patient" close={()=>setShowPatient(false)}><PatientForm close={()=>setShowPatient(false)}/></Modal>}
    {showScan && <Modal title="AI Invoice → Stock" close={()=>setShowScan(false)}><InvoiceScan close={()=>setShowScan(false)}/></Modal>}
  </div>
}

function Dashboard({onNewPatient,onScan}:{onNewPatient:()=>void;onScan:()=>void}) { return <section className="content">
  <div className="welcome"><div><h2>Hospital overview</h2><p>Here’s what is happening today.</p></div><div className="date"><CalendarDays size={17}/> 12 September 2026</div></div>
  <div className="stats"><Stat icon={<Users/>} label="Patients today" value="48" delta="+12%"/><Stat icon={<Stethoscope/>} label="OPD consultations" value="36" delta="+8%"/><Stat icon={<FlaskConical/>} label="Lab tests" value="27" delta="+15%"/><Stat icon={<ShoppingCart/>} label="Today’s collection" value="₹86,420" delta="+11%"/></div>
  <div className="quick"><div className="sectionHead"><div><h3>Quick actions</h3><p>Common tasks for your staff</p></div></div><div className="quickGrid"><Action icon={<UserRound/>} title="New patient" text="Register patient" onClick={onNewPatient}/><Action icon={<CalendarDays/>} title="Appointment" text="Book OPD"/><Action icon={<Pill/>} title="Pharmacy" text="Open billing"/><Action icon={<Package/>} title="Scan purchase bill" text="AI stock entry" onClick={onScan}/></div></div>
  <div className="grid2"><div className="panel"><div className="sectionHead"><div><h3>Today’s patients</h3><p>Latest registrations and visits</p></div><button className="linkBtn">View all <ChevronRight size={16}/></button></div><PatientTable compact/></div><div className="panel"><div className="sectionHead"><div><h3>Pharmacy alerts</h3><p>Needs staff attention</p></div></div><Alert title="8 medicines" text="Low stock" type="warning"/><Alert title="14 batches" text="Expiring within 90 days" type="danger"/><Alert title="1 invoice" text="Waiting for stock confirmation" type="info"/></div></div>
</section> }

function Stat({icon,label,value,delta}:{icon:React.ReactNode;label:string;value:string;delta:string}) {return <div className="stat"><div className="statIcon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{delta} <em>vs yesterday</em></small></div></div>}
function Action({icon,title,text,onClick}:{icon:React.ReactNode;title:string;text:string;onClick?:()=>void}) {return <button className="action" onClick={onClick}><div>{icon}</div><span><strong>{title}</strong><small>{text}</small></span><ChevronRight size={17}/></button>}
function Alert({title,text,type}:{title:string;text:string;type:string}) {return <div className="alert"><div className={`alertDot ${type}`}></div><div><strong>{title}</strong><span>{text}</span></div><ChevronRight size={16}/></div>}

function Patients({onNew,patients}:{onNew:()=>void;patients:Patient[]}) {return <section className="content"><div className="pageActions"><div><h2>Patient registry</h2><p>Search, register and manage patient records.</p></div><button className="primary" onClick={onNew}><Plus size={18}/> New patient</button></div><div className="panel"><PatientTable patients={patients}/></div></section>}
function PatientTable({patients=patients,compact=false}:{patients?:Patient[];compact?:boolean}) {return <div className="tableWrap"><table><thead><tr><th>Patient</th><th>ID</th><th>Age</th><th>Phone</th><th>Last visit</th><th>Status</th></tr></thead><tbody>{patients.slice(0,compact?4:20).map(p=><tr key={p.id}><td><strong>{p.name}</strong></td><td>{p.id}</td><td>{p.age}</td><td>{p.phone}</td><td>{p.lastVisit}</td><td><span className={`badge ${p.status.toLowerCase()}`}>{p.status}</span></td></tr>)}</tbody></table></div>}

function Pharmacy({onScan}:{onScan:()=>void}) {return <section className="content"><div className="pageActions"><div><h2>Pharmacy & Inventory</h2><p>Batch-wise stock, purchases and expiry management.</p></div><button className="primary" onClick={onScan}><Package size={18}/> Scan supplier bill</button></div><div className="stats"><Stat icon={<Package/>} label="Total items" value="1,284" delta="32 added"/><Stat icon={<Pill/>} label="Low stock" value="8" delta="Needs action"/><Stat icon={<CalendarDays/>} label="Expiring soon" value="14" delta="90 days"/><Stat icon={<ShoppingCart/>} label="Today purchases" value="₹52,480" delta="6 invoices"/></div><div className="panel"><div className="sectionHead"><div><h3>Current stock</h3><p>Batch and expiry tracking</p></div></div><div className="tableWrap"><table><thead><tr><th>Medicine</th><th>Batch</th><th>Expiry</th><th>Stock</th><th>MRP</th><th>Status</th></tr></thead><tbody>{medicines.map(m=><tr key={m.batch}><td><strong>{m.name}</strong></td><td>{m.batch}</td><td>{m.expiry}</td><td>{m.stock}</td><td>₹{m.mrp.toFixed(2)}</td><td><span className={`badge ${m.stock<20?'warning':'completed'}`}>{m.stock<20?'Low stock':'In stock'}</span></td></tr>)}</tbody></table></div></div></section>}

function Placeholder({title}:{title:string}) {return <section className="content"><div className="empty"><div className="emptyIcon"><Activity/></div><h2>{title}</h2><p>This module is scaffolded and ready for the next development phase.</p><button className="primary">Configure module</button></div></section>}
function Modal({title,close,children}:{title:string;close:()=>void;children:React.ReactNode}) {return <div className="overlay"><div className="modal"><div className="modalHead"><h2>{title}</h2><button onClick={close}><X/></button></div>{children}</div></div>}
function PatientForm({close}:{close:()=>void}) {return <div className="form"><label>Full name<input placeholder="Patient name"/></label><div className="formRow"><label>Age<input type="number" placeholder="Age"/></label><label>Gender<select><option>Select</option><option>Male</option><option>Female</option></select></label></div><label>Mobile number<input placeholder="10-digit mobile"/></label><label>Address<textarea placeholder="Address"/></label><div className="modalActions"><button className="secondary" onClick={close}>Cancel</button><button className="primary" onClick={close}>Register patient</button></div></div>}
function InvoiceScan({close}:{close:()=>void}) {const [confirmed,setConfirmed]=useState(false);return <div className="scan"><div className="dropzone"><Package size={34}/><strong>Supplier invoice detected</strong><span>AI PRO will extract medicine, batch, expiry, quantity, rate and GST.</span><button className="secondary">Choose invoice</button></div><div className="invoiceSummary"><div><span>Supplier</span><strong>Lennox Lifesciences</strong></div><div><span>Invoice</span><strong>SS00458</strong></div><div><span>Date</span><strong>11/08/2026</strong></div><div><span>Items detected</span><strong>10</strong></div></div><div className="confidence">✓ AI extraction complete <span>98% confidence</span></div><div className="modalActions"><button className="secondary" onClick={close}>Cancel</button><button className="primary" onClick={()=>setConfirmed(true)}>{confirmed?'Stock added ✓':'Verify & add stock'}</button></div>{confirmed&&<p className="success">10 items queued for batch-wise stock update. Audit record created.</p>}</div>}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
