let btn = document.querySelector("[type='submit']");
let results = document.querySelector(".results");

let tickets =[];

if(localStorage.savedTickets){
    tickets = JSON.parse(localStorage.savedTickets);
    updateView();
}

document.querySelector("[name='faultTime']").addEventListener("focus", function() {
  let d = new Date();
  this.value = `${d.getFullYear()}-${(d.getMonth()<10?'0':'')+d.getMonth()}-${(d.getDate()<10?'0':'')+d.getDate()}T${(d.getHours()<10?'0':'')+d.getHours()}:${(d.getMinutes()<10?'0':'')+d.getMinutes()}`
})
btn.onclick = function(e) {
    e.preventDefault()
    tickets.push({
        id: Date.now(),
        site: document.querySelector("[name='search']").value.toUpperCase(),
        cascade: document.querySelector("[name='cascade']").value,
        office: document.querySelector("[name='Office']").value,
        alarm : document.querySelector("[name='alarm']").value,
        source : document.querySelector("[name='source']").value,
        faultTime : document.querySelector("[name='faultTime']").value,
        rc : document.querySelector("[name='rc']").value,
    })
    tickets.sort((a,b)=>b.cascade - a.cascade);
    updateView();
}

function del_tt(ind){
    tickets.splice(ind,1);
    updateView();
}

function updateView() {
    localStorage.savedTickets = JSON.stringify(tickets);
    results.innerHTML="";
    document.getElementsByClassName("important")[0].innerHTML=`
        <div class="col">
          <div class="list">
            <h3>Down Sites</h3>
            <ul class="sa"></ul>
          </div>
        </div>
        <div class="col">
          <div class="list">
            <h3>HC Power Sites</h3>
            <ul class="hc"></ul>
            </div>
            </div>
            <div class="col">
            <div class="list">
            <h3>High Temp Sites</h3>
            <ul class="ht"></ul>
            </div>
            </div>
            <div class="col">
            <div class="list">
            <h3>Generator Power Sites</h3>
            <ul class="gen"></ul>
          </div>
        </div>`;

    for(let i = 0; i < tickets.length; i++){
        let {id,site,cascade,office,alarm,source,faultTime,rc} = tickets[i];
        if(document.getElementsByClassName(office)[0]=== undefined) {
            let col = document.createElement("div");
            col.classList.add("col");
            let newOffice = document.createElement("div");
            results.append(col);
            newOffice.classList.add("list");
            let ul = document.createElement("ul");
            ul.classList.add(office);
            newOffice.innerHTML = `<h3>${office}</h3>`
            col.append(newOffice);
            newOffice.append(ul);
        }
        let rf;
        if(alarm === "pwr"){
            if(source === "cmr")
                rf = "CPF";
            else if(source === "gen")
                rf = "VF Generator"
            else if(source === "egen")
                rf = "ET Generator"
            else if(source === "ogen")
                rf = "Orange Generator"
        }
        else if(alarm === "ht")
            rf = "High Temp";
        else if(alarm === "dwn")
            rf = `Down ${rc||""}`;
        else if(alarm === "cell")
            rf = "Cell Down";
        let tt = document.createElement("li");
        tt.innerHTML+= `<button type="button" class="close_btn" onclick="del_tt(${i})"><img src="images/close.svg" alt=""></button>`;
        tt.append(`${site } cascade ${cascade } sites || ${rf || alarm }`);
        document.getElementsByClassName(office )[0].append(tt)
        if(alarm === "dwn" || alarm === "cell"){
            let copy = tt.cloneNode(true);
            document.getElementsByClassName("sa")[0].append(copy)
        }
        if(alarm === "pwr") {
          if(cascade > 2) {
            let copy = tt.cloneNode(true);
            document.getElementsByClassName("hc")[0].append(copy)
          }
          if( source === "gen"){
              let copy = tt.cloneNode(true);
              document.getElementsByClassName("gen")[0].append(copy)
          }
        }
        if((alarm === "ht") && cascade > 2){
            let copy = tt.cloneNode(true);
            document.getElementsByClassName("ht")[0].append(copy)
        }
    }
}

