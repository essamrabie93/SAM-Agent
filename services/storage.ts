
import { KBEntry, AssetEntry, AppStats } from '../types';

const KB_KEY = 'sam_knowledge_base';
const ASSETS_KEY = 'sam_asset_base';
const STATS_KEY = 'sam_stats';

/**
 * 🚀 PERMANENT DATABASE (FOR VERCEL DEPLOYMENT)
 * -------------------------------------------
 * To make your data permanent for everyone:
 * 1. Go to IT Admin in your live app.
 * 2. Add your questions/assets.
 * 3. Click "Export for Code".
 * 4. Paste the JSON arrays below.
 */

const DEFAULT_KB: KBEntry[] = [
  {
    "id": "1768813226609",
    "question": "Slowness issue",
    "answer": "<div style=\"margin: 0px; padding: 0px; border-style: initial; border-color: initial; border-image: initial; outline: 0px; font-size: 14px; font-family: &quot;courier new&quot;, monospace; vertical-align: baseline; line-height: 1.3; word-break: normal; overflow-wrap: break-word; -webkit-font-smoothing: antialiased; color: rgb(18, 51, 76); background-color: rgb(255, 255, 255);\"><span dir=\"ltr\" style=\"margin: 0px; padding: 0px; border-style: initial; border-color: initial; border-image: initial; outline: 0px; font-weight: inherit; font-style: inherit; vertical-align: baseline; -webkit-font-smoothing: antialiased;\">Thanks for reporting this. &nbsp;Your laptop might need an update to fix this issue.</span></div><div style=\"margin: 0px; padding: 0px; border-style: initial; border-color: initial; border-image: initial; outline: 0px; font-size: 14px; font-family: &quot;courier new&quot;, monospace; vertical-align: baseline; line-height: 1.3; word-break: normal; overflow-wrap: break-word; -webkit-font-smoothing: antialiased; color: rgb(18, 51, 76); background-color: rgb(255, 255, 255);\"><span dir=\"ltr\" style=\"margin: 0px; padding: 0px; border-style: initial; border-color: initial; border-image: initial; outline: 0px; font-weight: inherit; font-style: inherit; vertical-align: baseline; -webkit-font-smoothing: antialiased;\">Can you please follow these steps below to run updates on your laptop?&nbsp;<br style=\"-webkit-font-smoothing: antialiased;\">&nbsp;</span></div><div style=\"margin: 0px; padding: 0px; border-style: initial; border-color: initial; border-image: initial; outline: 0px; font-size: 14px; font-family: &quot;courier new&quot;, monospace; vertical-align: baseline; line-height: 1.3; word-break: normal; overflow-wrap: break-word; -webkit-font-smoothing: antialiased; color: rgb(18, 51, 76); background-color: rgb(255, 255, 255);\">1. Search for \"Dell Command | Update\" from the Start menu.</div>"
  }
];

const DEFAULT_ASSETS: AssetEntry[] = [
  {
    "email": "youmna.hisham@assemblyglobal.com",
    "laptop": "18JNA67",
    "monitor": "3NZ9TJ3",
    "headset": "G41XHR",
    "dockingStation": "6HCDKP3",
    "keyboard": "",
    "mouse": "Mouse"
  },
  {
    "email": "ahmed.farag@assemblyglobal.com",
    "laptop": "98P44M3",
    "monitor": "",
    "headset": "FAW83D",
    "dockingStation": "",
    "keyboard": "",
    "mouse": ""
  },
  {
    "email": "reem.jenkiz@assemblyglobal.com",
    "laptop": "5KHDHW3",
    "monitor": "53Q9TJ3",
    "headset": "F4W83W",
    "dockingStation": "F3320T3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "acil.mostafa@assemblyglobal.com",
    "laptop": "83CKQ34",
    "monitor": "JSZ9TJ3",
    "headset": "F4W840",
    "dockingStation": "3132KP3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "nourhan.eldegwy@assemblyglobal.com",
    "laptop": "456KQ34",
    "monitor": "D8Q9TJ3",
    "headset": "G242LB",
    "dockingStation": "7W8GKP3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "reem.sleem@assemblyglobal.com",
    "laptop": "J46KQ34",
    "monitor": "HBV06P3",
    "headset": "G242LE",
    "dockingStation": "B0D07Z3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "sahar.nasser@assemblyglobal.com",
    "laptop": "2F78GK3",
    "monitor": "9B47TJ3",
    "headset": "G242HH",
    "dockingStation": "FNV4ZQ3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "eman.ibrahim@assemblyglobal.com",
    "laptop": "BVNBGK3",
    "monitor": "9FN9TJ3",
    "headset": "F4X9VA",
    "dockingStation": "DF26KP3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "maram.youssef@assemblyglobal.com",
    "laptop": "CJS34M3",
    "monitor": "7ZW9TJ3",
    "headset": "F4X9UX",
    "dockingStation": "6N90VS3",
    "keyboard": "CN0V96G6LO3002850B1FAO1",
    "mouse": "CN0145WWPRC003190BK4"
  },
  {
    "email": "ahd.shawky@assemblyglobal.com",
    "laptop": "G0LP893",
    "monitor": "98Q9TJ3",
    "headset": "G242L2",
    "dockingStation": "Docking Station",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "ahmed.elbahar@assemblyglobal.com",
    "laptop": "DSGJRV3",
    "monitor": "H5CCTJ3",
    "headset": "",
    "dockingStation": "2MHDKP3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "alaa.ashraf@assemblyglobal.com",
    "laptop": "94Z73M3",
    "monitor": "HV93GH3",
    "headset": "G242L0",
    "dockingStation": "8Z8GKP3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "bassmallah.sameh@assemblyglobal.com",
    "laptop": "PF59TL08",
    "monitor": "5HBCTJ3",
    "headset": "G242KV",
    "dockingStation": "CCK07Z3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "hussam.elnabawy@assemblyglobal.com",
    "laptop": "PF59TN3R",
    "monitor": "GRBJ3H3",
    "headset": "G6F3Y9",
    "dockingStation": "539GKP3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "jwairaya.wael@assemblyglobal.com",
    "laptop": "F2Z9GK3",
    "monitor": "8W9CTJ3",
    "headset": "G242LH",
    "dockingStation": "FXC07Z3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "menatalla.shalaby@assemblyglobal.com",
    "laptop": "48XD3M3",
    "monitor": "950W5P3",
    "headset": "G242LD",
    "dockingStation": "B8K07Z3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "yara.erfan@assemblyglobal.com",
    "laptop": "43896M3",
    "monitor": "F9Q9TJ3",
    "headset": "F4W830",
    "dockingStation": "5MHDKP3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "mohab.mohamed@assemblyglobal.com",
    "laptop": "4ZD9GK3",
    "monitor": "45P9TJ3",
    "headset": "G242L1",
    "dockingStation": "32630T3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "moataz.abdelbadae@assemblyglobal.com",
    "laptop": "88BDHW3",
    "monitor": "9YT06P3",
    "headset": "G242LC",
    "dockingStation": "5T57KP3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "randa.elhadad@assemblyglobal.com",
    "laptop": "GRS1RV3",
    "monitor": "1ZW9TJ3",
    "headset": "F4W836",
    "dockingStation": "8GX5KP3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "ahmed.hisham@assemblyglobal.com",
    "laptop": "C19JY2TX4R",
    "monitor": "VTV0CXV7",
    "headset": "G6F56L",
    "dockingStation": "6DL6KP3",
    "keyboard": "",
    "mouse": "Mouse"
  },
  {
    "email": "lama.ehab@assemblyglobal.com",
    "laptop": "D7Z1RV3",
    "monitor": "27Q9TJ3",
    "headset": "G3XWJN",
    "dockingStation": "C0T6KP3",
    "keyboard": "",
    "mouse": ""
  },
  {
    "email": "dima.nader@assemblyglobal.com",
    "laptop": "GM0W7WKT",
    "monitor": "2HR9TJ3",
    "headset": "G242LU",
    "dockingStation": "DMP6ZQ3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "nader.anwar@assemblyglobal.com",
    "laptop": "GM0THTFA",
    "monitor": "8Q9PZG3",
    "headset": "G4AL18",
    "dockingStation": "GGQ07Z3",
    "keyboard": "",
    "mouse": "Mouse"
  },
  {
    "email": "mohamed.ayman@assemblyglobal.com",
    "laptop": "DLWY5D3",
    "monitor": "JFN9TJ3",
    "headset": "F4X9UN",
    "dockingStation": "HXC30T3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "yasmine.elkasrawy@assemblyglobal.com",
    "laptop": "8R944M3",
    "monitor": "",
    "headset": "G242KN",
    "dockingStation": "",
    "keyboard": "",
    "mouse": ""
  },
  {
    "email": "sarayasser.khalil@assemblyglobal.com",
    "laptop": "PF4QTB6E",
    "monitor": "H2Q9TJ3",
    "headset": "F4W846",
    "dockingStation": "D09GKP3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "aya.kamal@assemblyglobal.com",
    "laptop": "PF4QTDFT",
    "monitor": "7W93GH3",
    "headset": "G242KK",
    "dockingStation": "J9CDKP3",
    "keyboard": "",
    "mouse": "Mouse"
  },
  {
    "email": "raghda.nabil@assemblyglobal.com",
    "laptop": "PF4QTHY6",
    "monitor": "G7Q9TJ3",
    "headset": "F4W839",
    "dockingStation": "GX16KP3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "zaid.dakin@assemblyglobal.com",
    "laptop": "JYWBGK3",
    "monitor": "",
    "headset": "",
    "dockingStation": "",
    "keyboard": "",
    "mouse": ""
  },
  {
    "email": "mai.hegazi@assemblyglobal.com",
    "laptop": "PF4QTNH8",
    "monitor": "64P9TJ3",
    "headset": "G242KW",
    "dockingStation": "12W4ZQ3",
    "keyboard": "",
    "mouse": ""
  },
  {
    "email": "ibrahim.elmotaz@assemblyglobal.com",
    "laptop": "PF4QTQQD",
    "monitor": "V5TKA283",
    "headset": "G6F57D",
    "dockingStation": "ZVQ2SZJC",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "jana.elkilany@assemblyglobal.com",
    "laptop": "PF4QTDH9",
    "monitor": "470W5P3",
    "headset": "G242LN",
    "dockingStation": "GYC07Z3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "yousef.samir@assemblyglobal.com",
    "laptop": "PF4QTB7D",
    "monitor": "V5TKA281",
    "headset": "G4AL0C",
    "dockingStation": "ZVQ2T04L",
    "keyboard": "",
    "mouse": "Mouse"
  },
  {
    "email": "dina.medhat@assemblyglobal.com",
    "laptop": "PF4R0YQ3",
    "monitor": "V5TKA292",
    "headset": "G3XWKE",
    "dockingStation": "ZVQ2CZAP",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "nourhan.atef@assemblyglobal.com",
    "laptop": "PF4QTDDR",
    "monitor": "V5TKA284",
    "headset": "G6F56P",
    "dockingStation": "ZVQ2SRSE",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "omar.zayed@assemblyglobal.com",
    "laptop": "PF4QTDEN",
    "monitor": "V5TKA295",
    "headset": "G6FA4AK",
    "dockingStation": "DY66KP3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "adham.hossam@assemblyglobal.com",
    "laptop": "PF4QTL6C",
    "monitor": "V5TKA279",
    "headset": "G3XWJT",
    "dockingStation": "ZVQ2CWFH",
    "keyboard": "",
    "mouse": "Mouse"
  },
  {
    "email": "ahmed.essam@assemblyglobal.com",
    "laptop": "PF4QTFQL",
    "monitor": "V5TKA290",
    "headset": "G41XH2",
    "dockingStation": "ZVQ2D093",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "sohaila.alaa@assemblyglobal.com",
    "laptop": "PF4QTLA8",
    "monitor": "V5TKA287",
    "headset": "G6F3YU",
    "dockingStation": "ZVQ2SYMJ",
    "keyboard": "",
    "mouse": "Mouse"
  },
  {
    "email": "marlen.botros@assemblyglobal.com",
    "laptop": "PF4QTNJ2",
    "monitor": "V5TKA273",
    "headset": "G41YML",
    "dockingStation": "ZVQ2CWAS",
    "keyboard": "",
    "mouse": ""
  },
  {
    "email": "nariman.tarek@assemblyglobal.com",
    "laptop": "PF4QTNHG",
    "monitor": "V5TKA288",
    "headset": "G6F49K",
    "dockingStation": "ZVQ2T001",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "radwa.hassan@assemblyglobal.com",
    "laptop": "PF4QTFQ3",
    "monitor": "V5TKA289",
    "headset": "G41YMF",
    "dockingStation": "ZVQ2D4MN",
    "keyboard": "",
    "mouse": "ZVQ2D4MN"
  },
  {
    "email": "salwa.shehab@assemblyglobal.com",
    "laptop": "PF4QTSZC",
    "monitor": "5W93GH3",
    "headset": "F4X9V2",
    "dockingStation": "8G26KP3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "menna.ayman@assemblyglobal.com",
    "laptop": "PF4QTLAD",
    "monitor": "V5TKA272",
    "headset": "G4AL0X",
    "dockingStation": "ZVR1D8CB",
    "keyboard": "",
    "mouse": "Mouse"
  },
  {
    "email": "youssef.tawfik@assemblyglobal.com",
    "laptop": "PF59TN02",
    "monitor": "7HBCTJ3",
    "headset": "F4W844",
    "dockingStation": "4J6DKP3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "manar.wasfy@assemblyglobal.com",
    "laptop": "4QDBHW3",
    "monitor": "5SZ9TJ3",
    "headset": "F4W84D",
    "dockingStation": "85H0VS3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "farah.osman@assemblyglobal.com",
    "laptop": "CD28GK3",
    "monitor": "8ZW9TJ3",
    "headset": "G242JM",
    "dockingStation": "C9B27Z3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "khaled.saleh@assemblyglobal.com",
    "laptop": "GCHDHW3",
    "monitor": "JDV9TJ3",
    "headset": "G6F3YX",
    "dockingStation": "H5630T3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "menna.gamil@assemblyglobal.com",
    "laptop": "BHLW5D3",
    "monitor": "48J13P3",
    "headset": "F4W83R",
    "dockingStation": "8YC30T3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "abeer.eissa@assemblyglobal.com",
    "laptop": "8B2X2M3",
    "monitor": "89P9TJ3",
    "headset": "F4W83M",
    "dockingStation": "CNV4ZQ3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "mariam.abdallah@assemblyglobal.com",
    "laptop": "1FGK4M3",
    "monitor": "B8Q9TJ3",
    "headset": "F4X9UD",
    "dockingStation": "409GKP3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "jihane.ahmad@assemblyglobal.com",
    "laptop": "5CBBGK3",
    "monitor": "4GN9TJ3",
    "headset": "F4W848",
    "dockingStation": "BDM6KP3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "yara.ashraf@assemblyglobal.com",
    "laptop": "C1F9GK3",
    "monitor": "15P9TJ3",
    "headset": "F4W83L",
    "dockingStation": "CPZ6KP3",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "norhan.sherif@assemblyglobal.com",
    "laptop": "F04LGK3",
    "monitor": "Monitor",
    "headset": "Headset",
    "dockingStation": "Dock",
    "keyboard": "Keyboard",
    "mouse": "CN0145WWPRC002740ERB"
  },
  {
    "email": "siham.elsanhoury@assemblyglobal.com",
    "laptop": "GM0W7WKX",
    "monitor": "VTV0CXW0",
    "headset": "G41YMM",
    "dockingStation": "ZVR1D8BW",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "omar.tantawy@assemblyglobal.com",
    "laptop": "GM0TL4BK",
    "monitor": "V5TKA291",
    "headset": "G6F3WL",
    "dockingStation": "ZVQ2CZEK",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "youssef.mohamed@assemblyglobal.com",
    "laptop": "GM0W7WKS",
    "monitor": "VTV0CYZU",
    "headset": "G41XH0",
    "dockingStation": "ZVR1D8E1",
    "keyboard": "",
    "mouse": "Mouse"
  },
  {
    "email": "rola.tarek@assemblyglobal.com",
    "laptop": "GM0W7WKV",
    "monitor": "V5TKA278",
    "headset": "G6F49D",
    "dockingStation": "ZVQ2T061",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "hala.fathy@assemblyglobal.com",
    "laptop": "GM0THTFC",
    "monitor": "V5TKA275",
    "headset": "G6F49M",
    "dockingStation": "ZVQ2T03N",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "omar.kamal@assemblyglobal.com",
    "laptop": "GM0W7WKQ",
    "monitor": "VTV0CYZ1",
    "headset": "G6F575",
    "dockingStation": "ZVQ2SYT7",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "ayah.harhara@assemblyglobal.com",
    "laptop": "GM0W7WKP",
    "monitor": "V5TKA286",
    "headset": "G6F49E",
    "dockingStation": "ZVQ2SZ9E",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "menna.abdelkhalek@assemblyglobal.com",
    "laptop": "GM0W7WKL",
    "monitor": "VTV0CYYY",
    "headset": "G4AL15",
    "dockingStation": "ZVR1D8FH",
    "keyboard": "",
    "mouse": "Mouse"
  },
  {
    "email": "abdelrahman.ashry@assemblyglobal.com",
    "laptop": "GM0TL4BL",
    "monitor": "VTV0CYYW",
    "headset": "G6F40G",
    "dockingStation": "ZVR1D87K",
    "keyboard": "",
    "mouse": "1SGX31L52655Z14G2MV7"
  },
  {
    "email": "alaa.hesham@assemblyglobal.com",
    "laptop": "GM0TL4BD",
    "monitor": "VTV0CXV0",
    "headset": "G6F3XM",
    "dockingStation": "ZVR1D84M",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "essam.rabie@core.assemblyglobal.com",
    "laptop": "GM0W7WKK",
    "monitor": "",
    "headset": "",
    "dockingStation": "",
    "keyboard": "",
    "mouse": ""
  },
  {
    "email": "mohamed.amin@assemblyglobal.com",
    "laptop": "GM0THTFB",
    "monitor": "VTV0CYZA",
    "headset": "G4AL05",
    "dockingStation": "ZVR1D8C0",
    "keyboard": "",
    "mouse": "Mouse"
  },
  {
    "email": "nada.attia@assemblyglobal.com",
    "laptop": "GM0W7WKW",
    "monitor": "VTV0CXVP",
    "headset": "G6F3YT",
    "dockingStation": "ZVR1D8DQ",
    "keyboard": "",
    "mouse": "Mouse"
  },
  {
    "email": "mohamed.emam@assemblyglobal.com",
    "laptop": "GM0TL4BJ",
    "monitor": "VTV0CYZK",
    "headset": "G6FADB",
    "dockingStation": "ZVR1D81F",
    "keyboard": "Keyboard",
    "mouse": "Mouse"
  },
  {
    "email": "omar.metwally@assemblyglobal.com",
    "laptop": "GM0W7WKN",
    "monitor": "VTV0CXVS",
    "headset": "",
    "dockingStation": "ZVR1D86H",
    "keyboard": "",
    "mouse": "Mouse"
  },
  {
    "email": "zeina.malek@assemblyglobal.com",
    "laptop": "FRXK79HXLG",
    "monitor": "",
    "headset": "G6F56M",
    "dockingStation": "",
    "keyboard": "",
    "mouse": ""
  },
  {
    "email": "maria.morcos@assemblyglobal.com",
    "laptop": "KG0HCX12MF",
    "monitor": "",
    "headset": "G6F49F",
    "dockingStation": "ZVR1D88Y",
    "keyboard": "",
    "mouse": "Mouse"
  }
];

export const getKB = (): KBEntry[] => {
  const localData = localStorage.getItem(KB_KEY);
  const localKB: KBEntry[] = localData ? JSON.parse(localData) : [];
  
  const kbMap = new Map<string, KBEntry>();
  
  // 1. Load defaults from code
  DEFAULT_KB.forEach(entry => {
    if (entry && typeof entry.question === 'string') {
      kbMap.set(entry.question.toLowerCase().trim(), entry);
    }
  });
  
  // 2. Overlay local storage
  localKB.forEach(entry => {
    if (entry && typeof entry.question === 'string') {
      kbMap.set(entry.question.toLowerCase().trim(), entry);
    }
  });
  
  return Array.from(kbMap.values());
};

export const saveKB = (entries: KBEntry[]) => {
  localStorage.setItem(KB_KEY, JSON.stringify(entries));
};

export const getAssets = (): AssetEntry[] => {
  const localData = localStorage.getItem(ASSETS_KEY);
  const localAssets: AssetEntry[] = localData ? JSON.parse(localData) : [];
  
  const assetMap = new Map<string, AssetEntry>();
  
  // 1. Load defaults from code
  DEFAULT_ASSETS.forEach(asset => {
    if (asset && typeof asset.email === 'string') {
      assetMap.set(asset.email.toLowerCase().trim(), asset);
    }
  });
  
  // 2. Overlay local storage
  localAssets.forEach(asset => {
    if (asset && typeof asset.email === 'string') {
      assetMap.set(asset.email.toLowerCase().trim(), asset);
    }
  });
  
  return Array.from(assetMap.values());
};

export const saveAssets = (entries: AssetEntry[]) => {
  localStorage.setItem(ASSETS_KEY, JSON.stringify(entries));
};

export const findAssetByEmail = (email: string): AssetEntry | undefined => {
  const assets = getAssets();
  return assets.find(a => a.email && a.email.toLowerCase() === email.toLowerCase().trim());
};

export const getStats = (): AppStats => {
  const data = localStorage.getItem(STATS_KEY);
  return data ? JSON.parse(data) : { accessCount: 0 };
};

export const incrementAccessCount = () => {
  const stats = getStats();
  const newStats = { ...stats, accessCount: stats.accessCount + 1 };
  localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
  return newStats.accessCount;
};

export const clearAllData = () => {
  localStorage.removeItem(KB_KEY);
  localStorage.removeItem(ASSETS_KEY);
};
