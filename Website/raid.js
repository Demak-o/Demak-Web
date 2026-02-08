function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const child of children) node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  return node;
}

const raid_data = {
  "wood door": { explosive_556: 18 },
  "sheet metal door": { explosive_556: 63 },
  "garage door": { rocket: 2, explosive_556: 40 },
  "armored door": { explosive_556: 50, rocket: 4 },
  "wood wall": { explosive_556: 48 },
  "stone wall": { rocket: 4 },
  "metal wall": { rocket: 8 },
  "armored wall": { c4: 7, explosive_556: 30 },
  "tool cupboard": { Molotov: 1 },
};

const crafting_resources = {
  explosive_556: { Sulfur: 50, Charcoal: 60, Metal_Frags: 10, metal_pipe: 0, Low_Grade: 0, Cloth: 0, tech_trash: 0 },
  rocket:        { Sulfur: 1400, Charcoal: 1950, Metal_Frags: 100, metal_pipe: 2, Low_Grade: 30, Cloth: 0, tech_trash: 0 },
  c4:            { Sulfur: 2200, Charcoal: 3000, Metal_Frags: 200, metal_pipe: 0, Low_Grade: 60, Cloth: 5, tech_trash: 2 },
  Molotov:       { Sulfur: 0, Charcoal: 0, Metal_Frags: 0, metal_pipe: 0, Low_Grade: 50, Cloth: 10, tech_trash: 0 },
};

const rowsWrap = document.getElementById("rows");
const resourcesOut = document.getElementById("resourcesOut");
const craftOut = document.getElementById("craftOut");
const err = document.getElementById("err");

function setError(msg){
  if(!msg){ err.hidden = true; err.textContent = ""; return; }
  err.hidden = false; err.textContent = msg;
}

const raidOptions = Object.keys(raid_data);

function makeRow(){
  const select = el("select", {}, raidOptions.map(opt => el("option", { value: opt }, [opt])));
  const qty = el("input", { type:"number", min:"0", step:"1", placeholder:"Qty" });

  const row = el("div", { class:"raid-row" }, [
    el("label", {}, [ select ]),
    el("label", {}, [ qty ])
  ]);

  return { row, select, qty };
}

let raidRows = [];

function addRow(){
  const r = makeRow();
  raidRows.push(r);
  rowsWrap.appendChild(r.row);
}

function reset(){
  rowsWrap.innerHTML = "";
  raidRows = [];
  addRow();
  resourcesOut.textContent = "";
  craftOut.textContent = "";
  setError("");
}

function calc(){
  try{
    setError("");

    const total = {
      Sulfur:0, Charcoal:0, Metal_Frags:0, metal_pipe:0, Low_Grade:0, Cloth:0, tech_trash:0,
      explosive_556:0, rocket:0, c4:0, Molotov:0
    };

    for(const r of raidRows){
      const structure = r.select.value;
      const qtyStr = (r.qty.value || "").trim();

      if(!structure) throw new Error("Please select a structure.");
      if(qtyStr === "") continue;

      if(!/^\d+$/.test(qtyStr)) throw new Error(`Invalid quantity: '${qtyStr}'. Please enter a valid number.`);
      const quantity = parseInt(qtyStr, 10);
      if(quantity === 0) continue;

      const structure_cost = raid_data[structure];
      if(!structure_cost) throw new Error(`Invalid structure selected: ${structure}`);

      // explosive device counts
      for(const [resource, amount] of Object.entries(structure_cost)){
        total[resource] += amount * quantity;
      }

      // crafting materials for each device type present
      for(const device of ["explosive_556","rocket","c4","Molotov"]){
        if(structure_cost[device]){
          const count = structure_cost[device] * quantity;
          const recipe = crafting_resources[device];
          for(const [res, per] of Object.entries(recipe)){
            total[res] += per * count;
          }
        }
      }
    }

    const resources_keys = ["Sulfur","Charcoal","Metal_Frags","metal_pipe","Low_Grade","Cloth","tech_trash"];
    const craft_keys = ["rocket","c4","explosive_556","Molotov"];

    resourcesOut.textContent = resources_keys.map(k => `${k}: ${total[k]}`).join("\n");
    craftOut.textContent = craft_keys.map(k => `${k}: ${total[k]}`).join("\n");

  } catch(e){
    setError(`Error: ${e.message || String(e)}`);
    resourcesOut.textContent = "";
    craftOut.textContent = "";
  }
}

document.getElementById("add").addEventListener("click", addRow);
document.getElementById("calc").addEventListener("click", calc);
document.getElementById("reset").addEventListener("click", reset);

// start with one row
reset();

