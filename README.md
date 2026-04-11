# Meta Ads Performance Dashboard

A read-only single-page dashboard that connects to the Meta Marketing API and visualises ad performance across multiple accounts. Built with React + Vite, Chart.js, and Tailwind CSS.

---

## Features

- **Facebook OAuth login** – login via the Facebook JS SDK with `ads_read` + `business_management` permissions
- **Multi-account selector** – switch between any ad account you have access to
- **Period comparison** – toggle "vs previous 7 days" to show green/red % change on every KPI
- **Overview tab** – 12 KPI cards + dual-axis Spend/ROAS line chart + Purchases bar chart
- **Campaigns tab** – sortable/filterable table; click a row to drill into its Ad Sets
- **Ad Sets tab** – same table; click a row to drill into its Ads
- **Ads tab** – grid of creative cards with thumbnails, sortable by any metric; click to expand full details
- **Loading skeletons, empty states, and error messages** throughout
- **Fully read-only** – no POST, PUT, PATCH, or DELETE calls anywhere in the codebase

---

## Setup

### 1 · Create a Meta App

1. Go to [developers.facebook.com](https://developers.facebook.com) and click **Create App**.
2. Choose **Business** as the app type.
3. Inside your new app, add the **Marketing API** product.
4. In **App Settings → Basic**, note your **App ID**.
5. Under **Facebook Login → Settings**, add the following to **Valid OAuth Redirect URIs**:
   ```
   http://localhost:5173/
   ```
   *(Add your production URL when deploying.)*
6. Under **App Review**, request the following permissions:
   - `ads_read`
   - `business_management`

   > For local testing you can use your own account without submitting for review (you are automatically a tester). For production use with other people's accounts, both permissions require App Review.

### 2 · Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and set your App ID:

```
VITE_FB_APP_ID=123456789012345
```

### 3 · Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4 · Build for production

```bash
npm run build       # outputs to dist/
npm run preview     # preview the production build locally
```

---

## Deploy to Vercel (zero-config)

1. Push the repository to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects Vite – no build settings needed.
4. Under **Environment Variables**, add `VITE_FB_APP_ID` with your app ID.
5. After the first deploy, copy the production URL (e.g. `https://your-app.vercel.app/`) and add it to **Valid OAuth Redirect URIs** in your Meta app settings.
6. Redeploy or trigger a new deploy for the env var to take effect.

---

## Project structure

```
src/
├── contexts/
│   └── AuthContext.jsx       # Facebook SDK init, login/logout state
├── hooks/
│   ├── useAdAccounts.js      # Fetch /me/adaccounts
│   └── useInsights.js        # Account / campaign / adset / ad level hooks
├── utils/
│   ├── metaApi.js            # Low-level fetch wrappers + metric parsers
│   ├── dateUtils.js          # Current / previous 7-day range helpers
│   ├── formatters.js         # fmtCurrency, fmtPercent, calcChange, …
│   └── metrics.js            # METRIC_DEFS, TABLE_COLUMNS, STATUS_STYLES
└── components/
    ├── Login.jsx
    ├── Header.jsx             # Sticky header with account selector & toggle
    ├── Dashboard.jsx          # Tab router + drill-down state
    ├── Overview.jsx           # KPI cards + charts
    ├── Campaigns.jsx          # Sortable campaign table
    ├── AdSets.jsx             # Sortable ad-set table
    ├── AdsGrid.jsx            # Creative card grid
    ├── AdCard.jsx             # Individual ad card + expand modal
    ├── KPICard.jsx            # Single KPI with change indicator
    ├── DataTable.jsx          # Reusable sortable/filterable table
    ├── SpendROASChart.jsx     # Dual-axis line chart
    ├── PurchasesChart.jsx     # Bar chart
    ├── SkeletonLoader.jsx     # Pulsing placeholders
    ├── EmptyState.jsx
    └── ErrorMessage.jsx
```

---

## Meta API details

| Setting | Value |
|---|---|
| API version | `v18.0` |
| Insights fields | `spend, impressions, reach, frequency, clicks, ctr, cpc, cpm, actions, action_values, purchase_roas` |
| `time_increment` | `1` (daily) |
| Level per tab | `account` / `campaign` / `adset` / `ad` |
| Purchases | `actions[action_type=omni_purchase]` |
| Revenue | `action_values[action_type=omni_purchase]` |
| ROAS | `purchase_roas[action_type=omni_purchase]` |
| Add to Carts | `actions[action_type=add_to_cart]` |

---

## Notes

- **Access token** is stored in `sessionStorage` and cleared on logout or when the Facebook session expires.
- **Pagination** is handled automatically – all pages of results are fetched before rendering.
- **Metric recomputation**: CTR, CPC, CPM, ROAS, CPA, and Frequency are *recomputed* from summed raw values instead of being averaged, to avoid double-counting across daily rows.
- **ROAS and revenue** are only meaningful if the Meta Pixel is correctly firing `Purchase` events on the advertiser's site.
