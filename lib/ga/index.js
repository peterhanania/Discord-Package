// log the pageview with their URL
export const pageview = (url) => {
  window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
    page_path: url,
  });
};

// log specific events happening.
export const event = ({ action, params }) => {
  window.gtag("event", action, params);
};

export function getSymbol(amount, mostUsedCurrency){
  let jsonData = require('../../components/json/other/currencies.json');
  let result;
  for (var i =0; i<jsonData.length; i++){
    if (jsonData[i].currency === mostUsedCurrency){
      if (jsonData[i].side === "left"){
        result = jsonData[i].symbol+amount;
      }else{
        result = amount+jsonData[i].symbol;
      }
      console.log(result);
      return result;
    }
  }
  return "";
}
