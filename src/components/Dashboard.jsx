import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useAdAccounts } from '../hooks/useAdAccounts.js';
import { getDateRanges } from '../utils/dateUtils.js';
import Header from './Header.jsx';
import Overview from './Overview.jsx';
import Campaigns from './Campaigns.jsx';
import AdSets from './AdSets.jsx';
import AdsGrid from './AdsGrid.jsx';
import EmptyState from './EmptyState.jsx';

const TABS = [
  { id: 'overview',   label: 'Overview' },
  { id: 'campaigns',  label: 'Campaigns' },
  { id: 'adsets',     label: 'Ad Sets' },
  { id: 'ads',        label: 'Ads' },
];

export default function Dashboard() {
  const { accessToken }             = useAuth();
  const { accounts, loading: accsLoading } = useAdAccounts(accessToken);

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [activeTab, setActiveTab]             = useState('overview');
  const [showComparison, setShowComparison]   = useState(true);

  // Drill-down state
  const [drillDown, setDrillDown] = useState({
    campaignId:   null,
    campaignName: null,
    adsetId:      null,
    adsetName:    null,
  });

  // Auto-select first account
  useEffect(() => {
    if (!selectedAccount && accounts.length > 0) {
      setSelectedAccount(accounts[0]);
    }
  }, [accounts, selectedAccount]);

  // Date ranges are stable for the session
  const dateRanges = useMemo(() => getDateRanges(), []);

  function handleTabChange(tabId) {
    setActiveTab(tabId);
    // Reset drill-down when manually switching tabs
    setDrillDown({ campaignId: null, campaignName: null, adsetId: null, adsetName: null });
  }

  function handleCampaignDrillDown({ campaignId, campaignName }) {
    setDrillDown((d) => ({ ...d, campaignId, campaignName, adsetId: null, adsetName: null }));
    setActiveTab('adsets');
  }

  function handleAdSetDrillDown({ adsetId, adsetName }) {
    setDrillDown((d) => ({ ...d, adsetId, adsetName }));
    setActiveTab('ads');
  }

  function handleAccountChange(acc) {
    setSelectedAccount(acc);
    setActiveTab('overview');
    setDrillDown({ campaignId: null, campaignName: null, adsetId: null, adsetName: null });
  }

  const commonProps = {
    accessToken,
    accountId:  selectedAccount?.id,
    dateRanges,
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header
        accounts={accounts}
        accountsLoading={accsLoading}
        selectedAccount={selectedAccount}
        onSelectAccount={handleAccountChange}
        dateRanges={dateRanges}
        showComparison={showComparison}
        onToggleComparison={() => setShowComparison((v) => !v)}
      />

      {/* Tab bar */}
      <div className="bg-zinc-950 border-b border-zinc-800 sticky top-14 z-30">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                }`}
              >
                {tab.label}
                {tab.id === 'adsets' && drillDown.campaignId && (
                  <span className="ml-1.5 text-xs bg-blue-600/30 text-blue-400 px-1.5 py-0.5 rounded-full">
                    filtered
                  </span>
                )}
                {tab.id === 'ads' && drillDown.adsetId && (
                  <span className="ml-1.5 text-xs bg-blue-600/30 text-blue-400 px-1.5 py-0.5 rounded-full">
                    filtered
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        {!selectedAccount && !accsLoading ? (
          <EmptyState
            message="No ad accounts found. Make sure your Facebook account has access to at least one Meta Ads account."
          />
        ) : selectedAccount ? (
          <>
            {activeTab === 'overview' && (
              <Overview {...commonProps} showComparison={showComparison} />
            )}
            {activeTab === 'campaigns' && (
              <Campaigns {...commonProps} onDrillDown={handleCampaignDrillDown} />
            )}
            {activeTab === 'adsets' && (
              <AdSets
                {...commonProps}
                campaignId={drillDown.campaignId}
                campaignName={drillDown.campaignName}
                onClearFilter={() =>
                  setDrillDown((d) => ({ ...d, campaignId: null, campaignName: null }))
                }
                onDrillDown={handleAdSetDrillDown}
              />
            )}
            {activeTab === 'ads' && (
              <AdsGrid
                {...commonProps}
                adsetId={drillDown.adsetId}
                adsetName={drillDown.adsetName}
                onClearFilter={() =>
                  setDrillDown((d) => ({ ...d, adsetId: null, adsetName: null }))
                }
              />
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}
