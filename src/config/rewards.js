// ===============================================
// REWARDS CONFIGURATION - EDIT THIS FILE TO UPDATE REWARDS
// ===============================================

export const STREAK_BADGES = [
    { days: 10, icon: "🌟", title: "Rising Star" },
    { days: 20, icon: "🔥", title: "On Fire" },
    { days: 30, icon: "💪", title: "Unstoppable" },
    { days: 40, icon: "🏆", title: "Champion" },
    { days: 50, icon: "👑", title: "Legend" },
    { days: 60, icon: "💎", title: "Diamond" },
    { days: 70, icon: "🚀", title: "Rocket" },
    { days: 80, icon: "⚡", title: "Lightning" },
    { days: 90, icon: "🎯", title: "Perfectionist" },
    { days: 100, icon: "🌈", title: "Ultimate" },
];

// ===============================================
// BRAND REWARDS - UPDATE THESE AS NEEDED
// ===============================================
// Required streak days to unlock each reward
// coupon: The actual coupon code users will copy
// ===============================================

export const BRAND_REWARDS = [
    {
        id: 1,
        brand: "JioSaavn",
        logo: "🎵",
        title: "JioSaavn Pro",
        description: "1 Month Free Premium",
        coupon: "JIOSAAVN-ATTENDO-2026",
        requiredDays: 10,
        color: "from-green-500/20 to-emerald-500/20",
        borderColor: "border-green-500/30"
    },
    {
        id: 2,
        brand: "BigBasket",
        logo: "🛒",
        title: "₹100 OFF",
        description: "On orders above ₹500",
        coupon: "BBATTENDO100",
        requiredDays: 20,
        color: "from-yellow-500/20 to-orange-500/20",
        borderColor: "border-yellow-500/30"
    },
    {
        id: 3,
        brand: "Audible",
        logo: "🎧",
        title: "Audible Premium Plus",
        description: "2 Months Free Trial",
        coupon: "JAUD2MFT",
        requiredDays: 30,
        color: "from-orange-500/20 to-red-500/20",
        borderColor: "border-orange-500/30"
    },
    {
        id: 4,
        brand: "Swiggy",
        logo: "🍔",
        title: "Swiggy One",
        description: "1 Month Free Membership",
        coupon: "SWIGGY1MONTH",
        requiredDays: 40,
        color: "from-orange-500/20 to-yellow-500/20",
        borderColor: "border-orange-500/30"
    },
    {
        id: 5,
        brand: "Amazon Prime",
        logo: "📦",
        title: "Prime Video",
        description: "1 Month Free Access",
        coupon: "PRIMEVIDEO30",
        requiredDays: 50,
        color: "from-blue-500/20 to-cyan-500/20",
        borderColor: "border-blue-500/30"
    },
    {
        id: 6,
        brand: "Spotify",
        logo: "🎶",
        title: "Spotify Premium",
        description: "3 Months Free",
        coupon: "SPOTIFY3MATTENDO",
        requiredDays: 60,
        color: "from-green-500/20 to-lime-500/20",
        borderColor: "border-green-500/30"
    },
    {
        id: 7,
        brand: "Zomato",
        logo: "🍕",
        title: "Zomato Gold",
        description: "2 Months Membership",
        coupon: "ZOMATOGOLD2M",
        requiredDays: 70,
        color: "from-red-500/20 to-pink-500/20",
        borderColor: "border-red-500/30"
    },
    {
        id: 8,
        brand: "Netflix",
        logo: "🎬",
        title: "Netflix Standard",
        description: "1 Month Free",
        coupon: "NETFLIX1MATTENDO",
        requiredDays: 80,
        color: "from-red-600/20 to-red-500/20",
        borderColor: "border-red-600/30"
    },
    {
        id: 9,
        brand: "YouTube",
        logo: "▶️",
        title: "YouTube Premium",
        description: "2 Months Free",
        coupon: "YTPREMIUM2M",
        requiredDays: 90,
        color: "from-red-500/20 to-rose-500/20",
        borderColor: "border-red-500/30"
    },
    {
        id: 10,
        brand: "Special",
        logo: "🎁",
        title: "Mystery Gift Box",
        description: "Exclusive IDEAZIN Merchandise",
        coupon: "ULTIMATEGIFT100",
        requiredDays: 100,
        color: "from-purple-500/20 to-pink-500/20",
        borderColor: "border-purple-500/30"
    },
];
