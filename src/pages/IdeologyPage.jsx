import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { FadeUp } from '../components/FadeUp'

export default function IdeologyPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <SiteHeader />

      {/* ── Section 1：Hero ── */}
      <section
        style={{
          position: 'relative',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          overflow: 'hidden',
          paddingTop: '64px',
        }}
      >
        {/*
          TODO: 圖片替換區
          規格：AI 生成（Adobe Firefly）
          題材：台灣田野遠景，晨光或午後光線，象徵「土地」與「邏輯」並存的開闊感
          人物：僅允許遠景渺小身影，禁止完整人臉，禁止蔬果近距離特寫
          比例：16:9 或更高，桌面至少 1440×900
          路徑：替換時修改下方 backgroundImage
        */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            /* 暫用漸層佔位，替換成圖片時改為：
               backgroundImage: 'url(/images/ideology-hero.jpg)',
               backgroundSize: 'cover',
               backgroundPosition: 'center',
            */
            background: 'linear-gradient(160deg, #d8d5cc 0%, #a8a49a 40%, #6e6a60 100%)',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 'var(--max-content-width)',
            width: '100%',
            margin: '0 auto',
            padding: '0 40px 80px',
          }}
        >
          <FadeUp delay={0}>
            <p
              style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '0.22em',
                marginBottom: '20px',
                fontWeight: 500,
              }}
            >
              PHILOSOPHY
            </p>
            <h1
              style={{
                fontFamily: 'Noto Serif TC, serif',
                fontSize: 'clamp(28px, 5vw, 52px)',
                fontWeight: 600,
                color: '#ffffff',
                lineHeight: 1.4,
                letterSpacing: '0.08em',
              }}
            >
              重視生命。<br />尊重自然。<br />相信邏輯。
            </h1>
          </FadeUp>
        </div>
      </section>

      {/* ── Section 2：三好 ── */}
      <section
        style={{
          maxWidth: 'var(--max-content-width)',
          margin: '0 auto',
          padding: '120px 40px',
        }}
      >
        <FadeUp delay={0} style={{ marginBottom: '64px' }}>
          <p
            style={{
              fontSize: '11px',
              color: 'var(--ink-secondary)',
              letterSpacing: '0.22em',
              marginBottom: '16px',
              fontWeight: 500,
            }}
          >
            THREE GOODS
          </p>
          <h2
            style={{
              fontFamily: 'Noto Serif TC, serif',
              fontSize: 'clamp(20px, 3vw, 28px)',
              fontWeight: 600,
              color: 'var(--ink-primary)',
              letterSpacing: '0.06em',
            }}
          >
            三好
          </h2>
        </FadeUp>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '48px',
          }}
        >
          <FadeUp delay={0}>
            <GoodItem
              label="好喝"
              body="每天願意喝，才算數。我們的起點不是「有效」，而是「你會想喝完它」——口感設計先於任何功能宣稱。"
            />
          </FadeUp>
          <FadeUp delay={150}>
            <GoodItem
              label="好看"
              body="六色植萃的顏色不是後製染出來的，是食材本身的顏色。視覺上讓人放心，因為它本來就應該長這樣。"
            />
          </FadeUp>
          <FadeUp delay={300}>
            <GoodItem
              label="好吸收"
              body="身體熟悉的語言，才能真正吸收。台灣在地食材，不是異國奇珍，是你的細胞本來就認識的東西。"
            />
          </FadeUp>
        </div>
      </section>

      {/* ── Section 3：三無 ── */}
      <section
        style={{
          backgroundColor: 'var(--ink-primary)',
          padding: '120px 40px',
        }}
      >
        <div style={{ maxWidth: 'var(--max-content-width)', margin: '0 auto' }}>
          <FadeUp delay={0} style={{ marginBottom: '64px' }}>
            <p
              style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.22em',
                marginBottom: '16px',
                fontWeight: 500,
              }}
            >
              THREE NONES
            </p>
            <h2
              style={{
                fontFamily: 'Noto Serif TC, serif',
                fontSize: 'clamp(20px, 3vw, 28px)',
                fontWeight: 600,
                color: '#ffffff',
                letterSpacing: '0.06em',
              }}
            >
              三無
            </h2>
          </FadeUp>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '48px',
            }}
          >
            <FadeUp delay={0}>
              <NoneItem
                label="無人工"
                body="不使用人工色素、人工香料、人工甜味劑。顏色和氣味來自食材，不來自實驗室。"
              />
            </FadeUp>
            <FadeUp delay={150}>
              <NoneItem
                label="無化學"
                body="配方不依賴化學添加物來延長保存或強化口感。成分表上的每個字，你應該都能理解它是什麼。"
              />
            </FadeUp>
            <FadeUp delay={300}>
              <NoneItem
                label="無合成"
                body="不添加合成維生素或濃縮萃取物取代真實食材。你喝到的，是食物本身，不是食物的替身。"
              />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Section 4：永續飲食 ── */}
      <section
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '120px 40px',
        }}
      >
        <FadeUp delay={0} style={{ marginBottom: '48px' }}>
          <p
            style={{
              fontSize: '11px',
              color: 'var(--ink-secondary)',
              letterSpacing: '0.22em',
              marginBottom: '16px',
              fontWeight: 500,
            }}
          >
            SUSTAINABLE EATING
          </p>
          <h2
            style={{
              fontFamily: 'Noto Serif TC, serif',
              fontSize: 'clamp(20px, 3vw, 28px)',
              fontWeight: 600,
              color: 'var(--ink-primary)',
              letterSpacing: '0.06em',
              marginBottom: '12px',
            }}
          >
            植本邏輯支持永續飲食計劃
          </h2>
          <p
            style={{
              fontFamily: 'Noto Serif TC, serif',
              fontSize: '15px',
              color: 'var(--ink-secondary)',
              letterSpacing: '0.08em',
              marginBottom: '40px',
            }}
          >
            為什麼堅持台灣在地食材
          </p>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--ink-secondary)',
              lineHeight: '2.2',
              letterSpacing: '0.06em',
              marginBottom: '24px',
            }}
          >
            聯合國糧農組織與世界衛生組織在2019年共同提出「永續健康飲食」的框架，
            其中有幾個核心原則反覆出現：
            低環境衝擊、保護生物多樣性、在地與季節性食材優先、文化適切性。
          </p>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--ink-secondary)',
              lineHeight: '2.2',
              letterSpacing: '0.06em',
              marginBottom: '24px',
            }}
          >
            植本邏輯的選材邏輯，從一開始就沿著這個方向走：
            地瓜葉、青江菜、老薑、薑黃、桂花——這些是台灣田間本來就有的食材，
            不是因為異國稀有才選它們，而是因為它們本來就在這裡，
            不需要長途運輸，也不需要反季節栽培。
          </p>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--ink-secondary)',
              lineHeight: '2.2',
              letterSpacing: '0.06em',
            }}
          >
            我們走進台灣的鄉間田林，尋找真正有價值的植物來源。
            這不是行銷語言——這是研發起點的真實限制，
            也是我們認為最誠實的一個選擇。
          </p>
        </FadeUp>
      </section>

      {/* ── Section 5：導引 ── */}
      <section
        style={{
          maxWidth: 'var(--max-content-width)',
          margin: '0 auto',
          padding: '0 40px 120px',
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        <FadeUp delay={0}>
          <a
            href="/series"
            style={ctaStyle}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            探索植萃系列
          </a>
        </FadeUp>
        <FadeUp delay={150}>
          <a
            href="/"
            style={{ ...ctaStyle, backgroundColor: 'transparent', color: 'var(--ink-secondary)', border: '1px solid var(--ink-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            回到首頁
          </a>
        </FadeUp>
      </section>

      <SiteFooter />
    </div>
  )
}

function GoodItem({ label, body }) {
  return (
    <div>
      <p
        style={{
          fontFamily: 'Noto Serif TC, serif',
          fontSize: '22px',
          fontWeight: 600,
          color: 'var(--ink-primary)',
          letterSpacing: '0.1em',
          marginBottom: '16px',
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: '14px',
          color: 'var(--ink-secondary)',
          lineHeight: '2',
          letterSpacing: '0.06em',
        }}
      >
        {body}
      </p>
    </div>
  )
}

function NoneItem({ label, body }) {
  return (
    <div>
      <p
        style={{
          fontFamily: 'Noto Serif TC, serif',
          fontSize: '22px',
          fontWeight: 600,
          color: '#ffffff',
          letterSpacing: '0.1em',
          marginBottom: '16px',
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.6)',
          lineHeight: '2',
          letterSpacing: '0.06em',
        }}
      >
        {body}
      </p>
    </div>
  )
}

const ctaStyle = {
  display: 'inline-block',
  backgroundColor: 'var(--forest, #243A33)',
  color: '#ffffff',
  fontSize: '13px',
  letterSpacing: '0.14em',
  fontWeight: 500,
  padding: '14px 32px',
  borderRadius: '999px',
  textDecoration: 'none',
  minHeight: '48px',
  lineHeight: '20px',
  transition: 'transform 250ms ease',
}
