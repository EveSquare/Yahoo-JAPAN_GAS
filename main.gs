//       ::::::::::    :::     :::       ::::::::::       ::::::::       ::::::::      :::    :::           :::        :::::::::       ::::::::::
//      :+:           :+:     :+:       :+:             :+:    :+:     :+:    :+:     :+:    :+:         :+: :+:      :+:    :+:      :+:
//     +:+           +:+     +:+       +:+             +:+            +:+    +:+     +:+    +:+        +:+   +:+     +:+    +:+      +:+
//    +#++:++#      +#+     +:+       +#++:++#        +#++:++#++     +#+    +:+     +#+    +:+       +#++:++#++:    +#++:++#:       +#++:++#
//   +#+            +#+   +#+        +#+                    +#+     +#+    +#+     +#+    +#+       +#+     +#+    +#+    +#+      +#+
//  #+#             #+#+#+#         #+#             #+#    #+#     #+#    #+#     #+#    #+#       #+#     #+#    #+#    #+#      #+#
// ##########        ###           ##########       ########       ###########    ########        ###     ###    ###    ###      ##########
//function getData() {
//    var url = "https://weather.yahoo.co.jp/weather/jp/23/5110.html";
//    var fromText = '<dl class="indexList_item indexList_item-clothing">';
//    var toText = '</dl>';
//  
//    var content = [];
//  
//    var contents = UrlFetchApp.fetch(url).getContentText();
//    var scraped = Parser
//                    .data(content)
//                    .from(fromText)
//                    .to(toText)
//                    .build();
//  
//    return scraped;
//}
//
//function item_list(){
//  var url = "https://weather.yahoo.co.jp/weather/jp/23/5110.html";
//  var contents = UrlFetchApp.fetch(url).getContentText();
//  var data = Parser.data(contents).from('<p class="index_text">').to('</p>').iterate();
//  return data;
//}

function get_sheet(x=1,y=1){
  var sheet=SpreadsheetApp.getActiveSheet();
  var value=sheet.getRange(x,y).getValue();
  console.log(value);
  return value;
}

function set_sheet(x=1,y=1,value) {
  var sheet=SpreadsheetApp.getActiveSheet();
  sheet.getRange(x,y).setFormula(value);
}

function import_xml(xpath){
  //SHEET関数
  var sheet_func = "IMPORTXML"+ "(\"" + xpath[0] + "\",\"" + xpath[1] + "\")";
  return sheet_func;
}

function send_mail(value){
  GmailApp.sendEmail(YOUR_MAIL_ADDRESS, "今日の天気予報", value, {name: "EveSquare"})
}


function myFunction() {
  var url = "https://weather.yahoo.co.jp/weather/jp/23/5110.html";
  //今日の最高気温
  var temp_high = [url,"//*[@id='main']/div[6]/table/tbody/tr/td[1]/div/ul/li[1]"];
  //今日の最低気温
  var temp_low = [url,"//*[@id='main']/div[6]/table/tbody/tr/td[1]/div/ul/li[2]"];
  //重ね着速報
  var item_clothing = [url,"//*[@id='index-01']/dl[4]"];
  
  //降水確率
  var precip_val = [];
  for(let i=1; i<5; i++){
    var xpath = "//*[@id='main']/div[6]/table/tbody/tr/td[1]/div/table/tbody/tr[2]/td[" + i + "]";
    var precip = [url,xpath];
    set_sheet(i+3,1,import_xml(precip));
    precip_val.push(get_sheet(i+3,1));
  }
  
  set_sheet(1,1,import_xml(temp_high));
  set_sheet(2,1,import_xml(temp_low));
  set_sheet(3,1,import_xml(item_clothing));
  var val = [];
  val.push(get_sheet(1,1));
  val.push(get_sheet(2,1));
  val.push(get_sheet(3,2));
  
  var mail_body = `今日の最高気温は${val[0]}°C。\n今日の最低気温は${val[1]}°C。\n${val[2]}\n降水確率は\n0-6時で${precip_val[0]}\n 6-12時で${precip_val[1]}\n 12-18時で${precip_val[2]}\n 18-24時で${precip_val[3]}です。\n`;
  send_mail(mail_body);
}
