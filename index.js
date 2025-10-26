document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('inputValue');
  const fromUnit = document.getElementById('fromUnit');
  const toUnit = document.getElementById('toUnit');
  const resultEl = document.getElementById('result');
  const swapBtn = document.getElementById('swapBtn');
  const clearBtn = document.getElementById('clearBtn');
  const copyBtn = document.getElementById('copyBtn');
  const historyList = document.getElementById('historyList');
  const toast = document.getElementById('toast');
  const themeToggle = document.getElementById('themeToggle');

  let history = [];

  function format(num){ return isFinite(num)? Number(num.toFixed(2)):'Invalid'; }

  function convert(value, from, to){
    let c;
    if(from==='c') c=value;
    else if(from==='f') c=(value-32)*5/9;
    else if(from==='k') c=value-273.15;
    else return NaN;

    if(to==='c') return c;
    if(to==='f') return (c*9/5)+32;
    if(to==='k') return c+273.15;
    return NaN;
  }

  function unitSymbol(u){
    if(u==='c') return '°C';
    if(u==='f') return '°F';
    if(u==='k') return 'K';
    return '';
  }

  function updateResult(){
    const val=parseFloat(input.value);
    if(isNaN(val)){ resultEl.innerHTML='<i class="fas fa-exclamation-circle"></i> Enter a valid number'; return; }
    const from=fromUnit.value;
    const to=toUnit.value;
    if(from===to){ resultEl.innerHTML=`${format(val)} ${unitSymbol(from)} (same unit)`; return; }

    const out=convert(val,from,to);
    resultEl.innerHTML=`${format(val)} ${unitSymbol(from)} → ${format(out)} ${unitSymbol(to)}`;

    const record=`${format(val)} ${unitSymbol(from)} → ${format(out)} ${unitSymbol(to)}`;
    history.unshift(record);
    if(history.length>10) history.pop();
    renderHistory();
  }

  function renderHistory(){
    historyList.innerHTML='';
    history.forEach(item=>{
      const li=document.createElement('li');
      li.textContent=item;
      historyList.appendChild(li);
    });
  }

  function showToast(msg){
    toast.textContent=msg;
    toast.style.opacity='1';
    setTimeout(()=>{ toast.style.opacity='0'; },1500);
  }

  input.addEventListener('input', updateResult);
  fromUnit.addEventListener('change', updateResult);
  toUnit.addEventListener('change', updateResult);

  swapBtn.addEventListener('click', ()=>{
    [fromUnit.value,toUnit.value]=[toUnit.value,fromUnit.value];
    updateResult();
  });

  clearBtn.addEventListener('click', ()=>{
    input.value='';
    resultEl.innerHTML='<i class="fas fa-info-circle"></i> Result will appear here';
  });

  copyBtn.addEventListener('click', ()=>{
    if(resultEl.textContent && !resultEl.textContent.includes('Result')){
      navigator.clipboard.writeText(resultEl.textContent).then(()=>showToast('Copied!'));
    }
  });

  input.addEventListener('keydown', e=>{ if(e.key==='Enter') updateResult(); });

  themeToggle.addEventListener('click', ()=>{
    document.body.classList.toggle('light');
    const icon=document.querySelector('#themeToggle i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
  });
});
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

clearHistoryBtn.addEventListener('click', () => {
  history = [];
  renderHistory();
  showToast('History cleared!');
});
