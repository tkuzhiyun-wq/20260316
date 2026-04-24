let inputField; // 宣告變數來儲存輸入框物件
let slider; // 宣告滑桿變數
let jumpButton; // 宣告按鈕變數
let selectElement; // 宣告下拉式選單變數
let radioElement; // 宣告選項按鈕變數
let isJumping = false; // 跳動狀態的開關
const colors = ['#3d5a80', '#98c1d9', '#e0fbfc', '#ee6c4d', '#293241'];
let iframeDiv; // 宣告 iframe div 變數
let iframe; // 宣告 iframe 變數

function setup() {
  // 防止出現捲軸 (取代原本 HTML 中的 CSS 設定)
  document.body.style.margin = '0';
  document.body.style.overflow = 'hidden';

  // 1. 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 2. 建立文字輸入框，預設文字為 "Hello"
  inputField = createInput('weeee');
  
  // 設定輸入框的位置 (左上角)
  inputField.position(20, 20);
  
  // 設定輸入框的樣式 (可選)
  inputField.style('font-size', '25px');
  inputField.style('padding', '5px');

  // 建立按鈕與滑桿
  jumpButton = createButton('切換跳動');
  jumpButton.mousePressed(toggleJump);
  jumpButton.style('height', '25px');
  slider = createSlider(15, 80, 30);

  // 設定輸入框寬度等於滑桿寬度加按鈕寬度
  inputField.style('width', (slider.width + jumpButton.width) + 'px');

  // 更新按鈕與滑桿的位置
  jumpButton.position(inputField.x + inputField.width + 30, 20);
  slider.position(jumpButton.x, jumpButton.y + jumpButton.height + 5);

  // 建立下拉式選單
  selectElement = createSelect();
  selectElement.position(jumpButton.x + jumpButton.width + 10, 20);
  selectElement.style('height', '25px');
  selectElement.option('淡江大學', 'https://www.tku.edu.tw');
  selectElement.option('教育科技學系', 'https://www.et.tku.edu.tw/');
  selectElement.option('教育部', 'https://www.edu.tw/Default.aspx');
  selectElement.option('關閉', 'close'); // 新增關閉選項
  selectElement.changed(updateIframeContent);

  // 建立選項按鈕：一般性、旋轉、大小
  radioElement = createRadio();
  radioElement.option('一般性');
  radioElement.option('旋轉');
  radioElement.option('大小');
  radioElement.selected('一般性'); // 預設選中一般性
  radioElement.position(selectElement.x + selectElement.width + 85, 22); // 定位在選單右邊
  radioElement.style('font-size', '16px');
  radioElement.style('width', '200px'); // 設定寬度以確保橫向排列

  textStyle(BOLD);
  noStroke();

  // 建立 iframe 的容器 div，距離視窗四周 200px
  iframeDiv = createDiv();
  iframeDiv.position(200, 280);
  iframeDiv.size(windowWidth - 400, windowHeight - 400);

  // 建立 iframe 並放入 div 中
  iframe = createElement('iframe');
  iframe.attribute('src', 'https://www.tku.edu.tw');
  iframe.style('width', '100%');
  iframe.style('height', '100%');
  iframe.parent(iframeDiv);
}

function draw() {
  // 每次重繪時清除背景，避免文字重疊殘影
  background('#bcbab9');

  // 根據滑桿數值設定文字大小
  textSize(slider.value());

  // 3. 動態取得輸入框內的內容
  let txt = inputField.value();
  
  // 如果輸入框是空的，就不執行繪製，避免無窮迴圈或錯誤
  if (txt.length > 0) {
    
    // 計算該字串的寬度
    let w = textWidth(txt);
    
    // 加上一點間距，讓文字不要黏在一起
    let spacing = 25; 
    let step = w + spacing;

    // 4. 利用迴圈計算與繪製
    // 外層迴圈控制 y 軸：從 100 開始，每隔 50px 畫一排
    let y = 100;
    let rowIndex = 0; // 用來記錄是第幾排，以製造波浪效果

    while (y < height) {
      // 將跳動計算移到迴圈內，針對每一排獨立計算
      let yOffset = 0;
      if (isJumping) {
        // 在 sin 函數中加入 rowIndex，讓每一排的相位錯開，產生不同步的跳動
        yOffset = sin(frameCount * 0.1 + rowIndex) * 10;
      }

      let mode = radioElement.value(); // 取得目前選中的模式
      let x = 0;
      let colIndex = 0; // 用來計算水平方向是第幾個字
      while (x < width) {
        push(); // 儲存當前的繪圖狀態
        // 移動座標原點到文字的位置 (包含 x 和 跳動後的 y)
        translate(x, y + yOffset);
        
        if (mode === '旋轉') {
          // -90度(-HALF_PI) 到 90度(HALF_PI) 的來回旋轉
          rotate(map(sin(frameCount * 0.1), -1, 1, -HALF_PI, HALF_PI));
        } else if (mode === '大小') {
          // 變大 30% (1.0 -> 1.3) 的來回縮放
          let s = map(sin(frameCount * 0.1), -1, 1, 1, 1.3);
          scale(s);
        }
        
        fill(colors[colIndex % colors.length]); // 根據水平位置設定顏色
        text(txt, 0, 0); // 在相對原點(0,0)繪製文字
        pop(); // 還原繪圖狀態

        x += step;
        colIndex++;
      }
      y += 50;
      rowIndex++;
    }
  }
}

// 當視窗大小改變時，調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 調整 iframe div 的大小，維持距離四周 200px
  if (iframeDiv) {
    iframeDiv.size(windowWidth - 400, windowHeight - 400);
  }
}

// 按鈕被按下時會呼叫這個函式
function toggleJump() {
  isJumping = !isJumping; // 將布林值反轉 (true -> false, false -> true)
}

// 下拉式選單改變時會呼叫這個函式
function updateIframeContent() {
  let selectedValue = selectElement.value();
  if (selectedValue === 'close') {
    iframeDiv.hide(); // 如果選擇關閉，隱藏 iframeDiv
  } else {
    iframeDiv.show(); // 確保 iframeDiv 是顯示的
    iframe.attribute('src', selectedValue); // 更新網址
  }
}
