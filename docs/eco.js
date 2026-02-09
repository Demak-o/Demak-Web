const Eco_data = {
  "wood door": { hatchet: 11, jackhammer: 2, "salvaged sword": 9, "wooden spear": 95, "salvaged axe": 7 },
  "soft side wood wall": { hatchet: 2, jackhammer: 1, "salvaged sword": 1, "wooden spear": 6, "salvaged axe": 1 },
  "soft side stone wall": { hatchet: 15, jackhammer: 1, "salvaged sword": 16, "wooden spear": 23, "salvaged axe": 10 },
  "tool cupboard": { hatchet: 6, jackhammer: 1, "salvaged sword": 5, "wooden spear": 48, "salvaged axe": 4 },
};

// Note: your Python has Eco_resources key "Jackhammer" (capital J) but Eco_data uses jackhammer (lower).
// I’m normalising it so the dropdown + lookup matches.
const Eco_resources = {
  hatchet: { metal_frags: 75, metal_pipe: 0, scrap: 0, wood: 100, blades: 0 },
  jackhammer: { metal_frags: 0, metal_pipe: 0, scrap: 150, wood: 0, blades: 0 },
  "salvaged axe": { metal_frags: 0, metal_pipe: 1, scrap: 0, wood: 0, blades: 5 },
  "wooden spear": { metal_frags: 0, metal_pipe: 0, scrap: 0, wood: 300, blades: 0 },
  "salvaged sword": { metal_frags: 15, metal_pipe: 0, scrap: 0, wood: 0, blades: 1 },
};

const structureSel = document.getElementById("structure");
const toolSel = document.getElementById("tool");
const out = document.getElementById("out");
const err = document.getElementById("err");

function setError(msg){
  if(!msg){ err.hidden = true; err.textContent = ""; return; }
  err.hidden = false; err.textContent = msg;
}

function fillSelect(select, values){
  select.innerHTML = "";
  for(const v of values){
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    select.appendChild(opt);
  }
}

fillSelect(structureSel, Object.keys(Eco_data));
fillSelect(toolSel, Object.keys(Eco_resources));

function calcEco(){
  try{
    setError("");
    const structure = structureSel.value;
    const tool = toolSel.value;

    if(!structure || !tool) throw new Error("Please select both a structure and a tool.");

    const structure_cost = Eco_data[structure];
    if(!structure_cost) throw new Error(`Invalid structure selected: ${structure}`);

    const required_tools = structure_cost[tool];
    if(!required_tools) throw new Error(`That tool isn’t listed for "${structure}".`);

    const tool_cost = Eco_resources[tool];
    if(!tool_cost) throw new Error(`No crafting data for tool: ${tool}`);

    const totals = {};
    for(const k of Object.keys(tool_cost)) totals[k] = 0;

    for(const [resource, per] of Object.entries(tool_cost)){
      totals[resource] += per * required_tools;
    }

    let text = "Total Resources Required:\n";
    for(const [k,v] of Object.entries(totals)){
      text += `${k}: ${v}\n`;
    }
    out.textContent = text;

  } catch(e){
    setError(`Error: ${e.message || String(e)}`);
    out.textContent = "";
  }
}

document.getElementById("calc").addEventListener("click", calcEco);
calcEco();

