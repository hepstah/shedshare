export type VibeMode = 'standard' | 'yard' | 'hiphop'

export interface VibeStrings {
  // -- Landing: Hero --
  landing: {
    heroTagline: string
    heroTitle: string
    heroDescription: string
    getStarted: string
    seeHowItWorks: string
    trustedBy: string
    signUpBonus: string
    signUpBonusSub: string

    // How It Works
    howStepCount: string
    howTitle: string
    howSubtitle: string
    steps: [
      { title: string; description: string },
      { title: string; description: string },
      { title: string; description: string },
      { title: string; description: string },
    ]

    // Features
    featuresLabel: string
    featuresTitle: string
    featuresSubtitle: string
    features: [
      { title: string; description: string },
      { title: string; description: string },
      { title: string; description: string },
      { title: string; description: string },
      { title: string; description: string },
      { title: string; description: string },
    ]

    // Nuts section
    nutsTitle: string
    nutsTitleAccent: string
    nutsSubtitle: string
    nutsItems: [
      { label: string; amount: string; description: string },
      { label: string; amount: string; description: string },
      { label: string; amount: string; description: string },
    ]

    // Footer CTA
    ctaTitle: string
    ctaSubtitle: string
    ctaButton: string
    footerTagline: string

    // Landing nav
    navHowItWorks: string
    navFeatures: string
    navSignIn: string
    navGetStarted: string
  }

  // -- Auth --
  auth: {
    home: string
    earlyAccess: string
    earlyAccessSubtext: string
    signIn: string
    signUp: string
    signInButton: string
    signUpButton: string
    switchToSignUp: string
    switchToSignIn: string
    continueWithGoogle: string
    continueWithApple: string
    emailPlaceholder: string
    passwordPlaceholder: string
    devLabel: string
    devLogin: string
    devNotConfigured: string
    or: string
  }

  // -- Dashboard --
  dashboard: {
    greeting: (name: string) => string
    subtitle: string
    statMyTools: string
    statCircles: string
    statLentOut: string
    statNuts: string
    pendingRequests: (count: number) => string
    pendingSubtext: string
    reviewButton: string
    recentActivity: string
    viewAll: string
    noActivity: string
    yourTools: string
    noToolsTitle: string
    noToolsSubtext: string
    addFirstTool: string
    yourCircles: string
    noCirclesTitle: string
    noCirclesSubtext: string
    createOrJoinCircle: string
    quickActions: string
    addATool: string
    findATool: string
    myCircles: string
    wantsToBorrow: (person: string) => string
    youRequested: string
  }

  // -- Tools --
  tools: {
    pageTitle: string
    addTool: string
    loading: string
    errorLoading: (msg: string) => string
    noToolsTitle: string
    noToolsSubtext: string
    addYourFirstTool: string
    noMatch: string
    backToMyTools: string
    backToTool: string
    editTool: string
    addATool: string
    loadingTool: string
    toolNotFound: string
    toolDeleted: string
    deleteConfirm: string
    edit: string
    deleting: string
    delete: string
    nutsCost: (cost: number) => string
    listedInCircles: (count: number) => string
    ownedBy: (name: string) => string
  }

  // -- Tool Form --
  toolForm: {
    photo: string
    addPhoto: string
    uploading: string
    name: string
    namePlaceholder: string
    description: string
    descriptionPlaceholder: string
    category: string
    categoryPlaceholder: string
    costLabel: string
    listInCircles: string
    loadingForm: string
    nameRequired: string
    imageFileRequired: string
    imageSizeLimit: string
    uploadFailed: string
    toolAdded: string
    toolUpdated: string
    adding: string
    saving: string
    addToolButton: string
    saveChanges: string
  }

  // -- Borrow --
  borrow: {
    borrowThisTool: string
    requestToBorrow: string
    requestDescription: string
    circlePlaceholder: string
    returnByLabel: string
    messageLabel: string
    messagePlaceholder: string
    cancel: string
    sendRequest: string
    sending: string
    circleRequired: string
    requestSent: string
  }

  // -- Request Actions --
  requestActions: {
    approve: string
    approveConfirm: string
    decline: string
    declineConfirm: string
    confirmHandoff: string
    handoffConfirm: string
    confirmReturn: string
    returnConfirm: string
    cancelRequest: string
    cancelConfirm: string
    actionSuccess: (action: string) => string
  }

  // -- Requests Page --
  requests: {
    pageTitle: string
    noIncoming: string
    noOutgoing: string
    noHistory: string
    noMatchFilters: string
    errorLoading: (msg: string) => string
    requestCount: (count: number) => string
    nutsCost: (amount: number) => string
    dueDate: (date: string) => string
  }

  // -- Circles --
  circles: {
    pageTitle: string
    newCircle: string
    loading: string
    errorLoading: (msg: string) => string
    noCirclesTitle: string
    noCirclesSubtext: string
    createTitle: string
    createDescription: string
    namePlaceholder: string
    descriptionPlaceholder: string
    creating: string
    createButton: string
    circleCreated: (name: string) => string
    backToCircles: string
    loadingCircle: string
    circleNotFound: string
    toolsInCircle: string
    loadingTools: string
    noToolsInCircle: string
    lastAdminError: string
    leftCircle: string
    leaving: string
    leaveCircle: string
    memberCount: (count: number) => string
  }

  // -- Join Circle --
  joinCircle: {
    title: string
    signInPrompt: string
    signInButton: string
    inviteCodePlaceholder: string
    circleNotFound: string
    lookingUp: string
    findCircle: string
    joining: string
    joinButton: string
    joinedCircle: (name: string) => string
  }

  // -- Invite --
  invite: {
    title: string
    copyLink: string
    codeCopied: string
    linkCopied: string
  }

  // -- Profile --
  profile: {
    yourInfo: string
    savingButton: string
    saveChanges: string
    displayNameRequired: string
    profileUpdated: string
    avatarUpdated: string
    avatarUploadFailed: string
    nutsBalance: (balance: number) => string
    noTransactions: string
    notificationPrefs: string
    prefsUpdated: string
    signOut: string
    memberSince: (date: string) => string
    uploadingAvatar: string
  }

  // -- Search --
  search: {
    pageTitle: string
    placeholder: string
    minChars: string
    searching: string
    noResults: (query: string) => string
  }

  // -- Notifications --
  notifications: {
    title: string
    markAllRead: string
    empty: string
  }

  // -- Errors --
  errors: {
    somethingWentWrong: string
    unexpectedError: string
    reloadPage: string
  }

  // -- Generic loading --
  loading: string

  // -- Filter/Sort labels (personality — the descriptive ones) --
  filters: {
    allStatuses: string
    allCategories: string
    newestFirst: string
    oldestFirst: string
    nameAZ: string
    nameZA: string
  }
}
