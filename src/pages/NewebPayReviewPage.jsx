import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

const products = [
  {
    name: '雪山植萃',
    unitPrice: 80,
    ingredients: ['白金基底液', '山藥', '銀耳', '生核桃', '豆薯', '蘋果', '紅棗', '老薑'],
    description: '以天然植物性食材製成的日常植萃飲品冰磚，採單包冷凍包裝，適合搭配水、植物奶、牛奶或其他飲品攪打飲用。',
  },
  {
    name: '青檸植萃',
    unitPrice: 80,
    ingredients: ['白金基底液', '地瓜葉', '青江菜', '櫛瓜', '黑木耳', '芭樂', '檸檬果肉', '香水檸檬皮'],
    description: '以青檸風味搭配植物性食材製成的冷凍植萃飲品冰磚，作為日常植物性飲食補充選擇。',
  },
  {
    name: '玫瑰植萃',
    unitPrice: 80,
    ingredients: ['白金基底液', '甜菜根', '紫甘藍', '銀耳', '紅棗', '芭樂', '百香果', '檸檬果肉', '玫瑰花瓣'],
    description: '以玫瑰風味搭配植物性食材製成的冷凍植萃飲品冰磚，適合日常飲用與風味變化。',
  },
  {
    name: '桂香植萃',
    unitPrice: 110,
    ingredients: ['白金基底液', '甜玉米', '紅蘿蔔', '黃甜椒', '豆薯', '百香果', '香蕉', '新鮮薑黃', '桂花蜜糖精釀液'],
    description: '以桂香風味搭配植物性食材製成的冷凍植萃飲品冰磚，採 7 天與 21 天套組販售。',
  },
  {
    name: '紫莓植萃',
    unitPrice: 110,
    ingredients: ['白金基底液', '木鱉果外種皮', '紫薯', '紅蘿蔔', '藍莓', '桑椹', '紫甘藍', '芭樂', '檸檬果肉', '維生素 C', '海鹽'],
    description: '以紫莓風味搭配植物性食材製成的冷凍植萃飲品冰磚，採單包冷凍包裝並以套組販售。',
  },
  {
    name: '鉑金植萃',
    unitPrice: 60,
    ingredients: ['大黃豆', '大薏仁', '南杏片', '葛鬱金粉'],
    description: '以植物性食材製成的冷凍植萃飲品冰磚，提供 7 天套組與 21 天套組作為日常飲用選擇。',
  },
]

const policies = [
  {
    title: '付款方式與收費模式',
    items: [
      '本網站販售商品以新台幣計價，商品頁會清楚標示售價、優惠價、數量與是否另收運費。',
      '正式上線後預計提供信用卡、ATM 虛擬帳號、LINE Pay 及人工銀行轉帳等付款方式；實際可用付款方式以結帳頁顯示為準。',
      '訂單成立後，系統會依商品類型建立訂單、付款紀錄與出貨資料；付款確認前不會安排冷凍配送。',
    ],
  },
  {
    title: '配送方式',
    items: [
      '植本邏輯自有飲品與冰磚商品採冷凍配送，配送範圍以台灣本島與實際物流可配送區域為準。',
      '商品建議冷凍保存，可冷凍保存 60 天；冷藏 4°C 可保存 7 天；短時間置於常溫陰涼處建議不超過 24 小時，仍以冷凍保存為主要保存方式。',
      '冷凍商品出貨前會確認付款狀態、收件人、電話與地址；若資料不完整，客服會先聯繫確認。',
      '商品出貨後，配送時效會受物流量、天候、節慶、偏遠地區及不可抗力因素影響。',
    ],
  },
  {
    title: '退換貨政策',
    items: [
      '依消費者保護法及通訊交易解除權合理例外，冷凍食品、生鮮食品、短保存期限商品及已拆封、已退冰、已食用商品，因保存條件特殊，除商品瑕疵或配送異常外，恕不接受任意退貨。',
      '商品收到後請儘速放入冷凍保存；若因消費者保存不當、逾保存期限、拆封、退冰後未依建議方式保存或再次冷凍造成品質變化，恕無法受理退換貨。',
      '若收到商品時有包裝破損、明顯退冰、品項錯誤、數量短缺或其他配送異常，請於收到商品後 24 小時內拍照並聯繫客服。',
      '經客服確認屬商品瑕疵或配送異常者，植本邏輯將依情況協助補寄、換貨、退貨或退款。',
      '若訂單尚未出貨，消費者可聯繫客服申請取消；若已進入冷凍出貨流程，是否可取消將依實際作業狀態判定。',
    ],
  },
  {
    title: '食品與健康聲明',
    items: [
      '植本邏輯商品為一般食品，非藥品、非醫療器材，不具診斷、治療、改善或預防疾病之效能。',
      '商品介紹僅作為食材、飲用方式與日常飲食補充情境說明，不作醫療療效宣稱。',
      '若有特殊疾病、懷孕、哺乳、過敏、用藥或特殊飲食限制，建議先諮詢醫師、營養師或專業人員。',
    ],
  },
  {
    title: '客服與隱私權',
    items: [
      '客服信箱：service@phytologic.tw。',
      '客服方式：可透過植本邏輯 LINE 官方帳號或客服信箱聯繫。',
      '植本邏輯會於訂單、配送、客服、會員服務與法令要求範圍內蒐集與使用必要個人資料，不會任意出售或提供個人資料予無關第三方。',
    ],
  },
]

function formatPrice(value) {
  return `NT$${value.toLocaleString()}`
}

function ProductCard({ product }) {
  const sevenDayPrice = product.unitPrice * 7
  const twentyOneDayPrice = product.unitPrice * 21

  return (
    <article className="newebpay-review-product-card">
      <div>
        <h3>{product.name}</h3>
        <p className="newebpay-review-price">單包 285g：{formatPrice(product.unitPrice)}</p>
      </div>
      <div className="newebpay-review-packages">
        <p>7 天套組 7 包：{formatPrice(sevenDayPrice)}</p>
        <p>21 天套組 21 包：{formatPrice(twentyOneDayPrice)}</p>
      </div>
      <div className="newebpay-review-ingredients">
        <span>主要食材</span>
        <p>{product.ingredients.join('、')}</p>
      </div>
      <p className="newebpay-review-description">{product.description}</p>
    </article>
  )
}

export default function NewebPayReviewPage() {
  return (
    <div className="newebpay-review-page">
      <SiteHeader />
      <main className="newebpay-review-main">
        <section className="newebpay-review-hero">
          <p className="newebpay-review-kicker">NEWEBPAY REVIEW</p>
          <h1>商店資訊與購物政策</h1>
          <p>
            植本邏輯生技股份有限公司提供全植物機能飲食產品，以天然蔬果、穀物與植物性食材製成植本機能飲冰磚與日常營養飲品。
            商品採冷凍配送，消費者可於家中搭配水、植物奶、牛奶、無糖茶或其他飲品攪打飲用。
          </p>
        </section>

        <section className="newebpay-review-panel">
          <h2>商店基本資料</h2>
          <dl className="newebpay-review-info-grid">
            <div><dt>公司名稱</dt><dd>植本邏輯生技股份有限公司</dd></div>
            <div><dt>商店名稱</dt><dd>植本邏輯</dd></div>
            <div><dt>網站</dt><dd>https://www.phytologic.tw</dd></div>
            <div><dt>商店地址</dt><dd>高雄市新興區中正三路31號9樓之1室</dd></div>
          </dl>
        </section>

        <section className="newebpay-review-panel">
          <div className="newebpay-review-note">
            <strong>共用基底與規格說明</strong>
            <p>
              白金基底液主要由大黃豆、南杏片、去芯白蓮子與葛鬱金粉製成；雪山植萃、青檸植萃、玫瑰植萃、桂香植萃與紫莓植萃皆搭配白金基底液製作。
              鉑金植萃為獨立配方，主要由大黃豆、大薏仁、南杏片與葛鬱金粉製成。
            </p>
            <p>每包規格為 285g；7 天套組為 7 包，21 天套組為 21 包。</p>
            <small>以下主要食材為商品資訊揭露用途，實際內容物名稱、含量順序、淨重、有效日期、保存方式與營養標示，以最終商品包裝標示為準。</small>
          </div>
          <h2>商品與價格</h2>
          <p className="newebpay-review-subtext">實際品項、優惠與庫存以商品頁及結帳頁顯示為準。</p>
          <div className="newebpay-review-products">
            {products.map(product => <ProductCard key={product.name} product={product} />)}
          </div>
        </section>

        <section className="newebpay-review-policy-grid">
          {policies.map(policy => (
            <article key={policy.title} className="newebpay-review-policy-card">
              <h2>{policy.title}</h2>
              <ul>
                {policy.items.map(item => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
