import type { VibeStrings } from '../types'

export const yard: VibeStrings = {
  landing: {
    heroTagline: 'Share tool, nuh buy two.',
    heroTitle: 'Di Yard Tool Library',
    heroDescription:
      "Borrow tool from yuh bredren, lend out yours when yuh nah use dem, an track everyting wid Nuts — ShedShare's lending currency.",
    getStarted: 'Start Fi Free',
    seeHowItWorks: 'See how it run',
    trustedBy: '500+ yard ah trust we',
    signUpBonus: '10 Free Nuts',
    signUpBonusSub: 'when yuh sign up',

    howStepCount: '4 Easy Step',
    howTitle: 'How It Run',
    howSubtitle: 'Four step fi share smarter',
    steps: [
      {
        title: 'Build Yuh Circle',
        description:
          'Start a crew fi yuh yard, yuh bredren, or yuh co-op. Invite people yuh trust.',
      },
      {
        title: 'Add Yuh Tool Dem',
        description:
          'List wah yuh own — drill, ladder, saw, camping gear. Set how yuh waan lend.',
      },
      {
        title: 'Browse & Borrow',
        description:
          'Need sumn? Search yuh circle. Send a request an coordinate pickup.',
      },
      {
        title: 'Earn Nuts',
        description:
          'Lend a tool, earn a Nut. Borrow one, spend a Nut. Everybody eat, everybody benefit.',
      },
    ],

    featuresLabel: 'Features',
    featuresTitle: 'Built Fi Real Yard People',
    featuresSubtitle: 'Everyting yuh need fi share tool wid yuh people dem',
    features: [
      {
        title: 'Trusted Circles',
        description:
          'Create private group fi yuh yard, family, or coworker. Only member can see an borrow.',
      },
      {
        title: 'Tool Inventory',
        description:
          'Catalog yuh tool dem wid photo an details. Track wah lend out an wah available.',
      },
      {
        title: 'Smart Search',
        description:
          'Find exactly wah yuh need across all yuh circles. Filter by category, availability, an distance.',
      },
      {
        title: 'Easy Request',
        description:
          'Send borrow request wid dates. Owner approve, yuh pick up. Simple handoff.',
      },
      {
        title: 'Nuts Economy',
        description:
          'Fair lending currency. Earn Nuts fi lending, spend dem fi borrow. Keep tings balanced.',
      },
      {
        title: 'Notifications',
        description:
          'Get notified bout request, approval, an due date. Never miss a handoff.',
      },
    ],

    nutsTitle: 'Nuts Economy',
    nutsTitleAccent: 'Fair sharing, built in.',
    nutsSubtitle: 'Simple currency dat keep sharing balanced',
    nutsItems: [
      {
        label: 'Sign Up Bonus',
        amount: '+10',
        description:
          'Every new member start wid 10 Nuts — enough fi borrow right away.',
      },
      {
        label: 'Lend a Tool',
        amount: '+1',
        description:
          'Every time somebody return yuh tool, yuh earn a Nut. Di more yuh share, di more yuh earn.',
      },
      {
        label: 'Borrow a Tool',
        amount: '-1',
        description:
          'Spend a Nut fi borrow keep tings fair. No freeloader, no awkward IOU.',
      },
    ],

    ctaTitle: 'Ready fi share smarter?',
    ctaSubtitle:
      "Join ShedShare today. It free fi start, an yuh get 10 Nuts jus fi signing up.",
    ctaButton: 'Start Fi Free',
    footerTagline: 'Share tool, nuh buy two. Built fi real yard people.',

    navHowItWorks: 'How It Run',
    navFeatures: 'Features',
    navSignIn: 'Sign In',
    navGetStarted: 'Come In',
  },

  auth: {
    home: 'Home',
    earlyAccess: 'Early Access',
    earlyAccessSubtext:
      'ShedShare deh pon early access. Sign in wid invite fi get started.',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signInButton: 'Sign In',
    signUpButton: 'Sign Up',
    switchToSignUp: "Nuh have account? Sign Up",
    switchToSignIn: 'Already have account? Sign In',
    continueWithGoogle: 'Continue wid Google',
    continueWithApple: 'Continue wid Apple',
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Password',
    devLabel: 'DEV',
    devLogin: 'Dev Login',
    devNotConfigured: 'Dev credentials nuh configured',
    or: 'OR',
  },

  dashboard: {
    greeting: (name) => `Wah gwaan, ${name}!`,
    subtitle: 'See wah ah gwan inna yuh shed.',
    statMyTools: 'My Tools',
    statCircles: 'Circles',
    statLentOut: 'Lent Out',
    statNuts: 'Nuts',
    pendingRequests: (count) =>
      `${count} request${count !== 1 ? 's' : ''} ah wait`,
    pendingSubtext: 'Somebody waan borrow yuh tool dem',
    reviewButton: 'Check It',
    recentActivity: 'Recent Activity',
    viewAll: 'See all',
    noActivity:
      'No activity yet — lend or borrow a tool fi get started!',
    yourTools: 'Yuh Tool Dem',
    noToolsTitle: 'Di shed bare bare',
    noToolsSubtext: 'Add yuh first tool fi yuh circles',
    addFirstTool: 'Add yuh first tool',
    yourCircles: 'Yuh Circles',
    noCirclesTitle: 'No circles yet',
    noCirclesSubtext: 'Create or join a circle fi start sharing',
    createOrJoinCircle: 'Create or join a circle',
    quickActions: 'Quick Actions',
    addATool: 'Add a Tool',
    findATool: 'Find a Tool',
    myCircles: 'My Circles',
    wantsToBorrow: (person) => `${person} waan borrow`,
    youRequested: 'Yuh request',
  },

  tools: {
    pageTitle: 'My Tools',
    addTool: 'Add Tool',
    loading: 'Loading tool dem...',
    errorLoading: (msg) => `Cyaan load tools: ${msg}`,
    noToolsTitle: 'No tool dem yet',
    noToolsSubtext: 'Add yuh first tool fi start lending to yuh circles.',
    addYourFirstTool: 'Add Yuh First Tool',
    noMatch: 'No tool match yuh filter.',
    backToMyTools: 'Back to My Tools',
    backToTool: 'Back to Tool',
    editTool: 'Edit Tool',
    addATool: 'Add a Tool',
    loadingTool: 'Loading tool...',
    toolNotFound: 'Tool nuh deh yah.',
    toolDeleted: 'Tool deleted. Gone.',
    deleteConfirm: 'Yuh sure yuh waan delete dis tool?',
    edit: 'Edit',
    deleting: 'Deleting...',
    delete: 'Delete',
    nutsCost: (cost) =>
      `${cost} nut${cost !== 1 ? 's' : ''} fi borrow`,
    listedInCircles: (count) =>
      `Listed inna ${count} circle${count !== 1 ? 's' : ''}`,
    ownedBy: (name) => `Owned by ${name}`,
  },

  toolForm: {
    photo: 'Photo',
    addPhoto: 'Add photo',
    uploading: 'Uploading...',
    name: 'Name',
    namePlaceholder: 'e.g. Circular Saw',
    description: 'Description',
    descriptionPlaceholder:
      'Describe yuh tool, condition, any accessories included...',
    category: 'Category',
    categoryPlaceholder: 'Pick a category',
    costLabel: 'Cost (nuts per borrow)',
    listInCircles: 'List in Circles',
    loadingForm: 'Loading form...',
    nameRequired: 'Tool name required.',
    imageFileRequired: 'Pick an image file.',
    imageSizeLimit: 'Image haffi be under 5 MB.',
    uploadFailed: 'Photo upload fail.',
    toolAdded: 'Tool added! Big up yuhself!',
    toolUpdated: 'Tool updated! Everyting criss.',
    adding: 'Adding...',
    saving: 'Saving...',
    addToolButton: 'Add Tool',
    saveChanges: 'Save Changes',
  },

  borrow: {
    borrowThisTool: 'Borrow Dis Tool',
    requestToBorrow: 'Request fi Borrow',
    requestDescription:
      "Send a borrow request to di owner. Dem get notified an can approve or decline.",
    circlePlaceholder: 'Pick a circle',
    returnByLabel: 'Return by (optional)',
    messageLabel: 'Message (optional)',
    messagePlaceholder: 'Yo! Mi waan borrow dis fi...',
    cancel: 'Cancel',
    sendRequest: 'Send Request',
    sending: 'Sending...',
    circleRequired: 'Pick a circle nuh.',
    requestSent: 'Request send out! Jus cool an wait.',
  },

  requestActions: {
    approve: 'Approve',
    approveConfirm: 'Approve dis borrow request?',
    decline: 'Decline',
    declineConfirm: 'Decline dis borrow request?',
    confirmHandoff: 'Confirm Handoff',
    handoffConfirm: 'Confirm yuh hand off di tool?',
    confirmReturn: 'Confirm Return',
    returnConfirm: 'Tool come back safe?',
    cancelRequest: 'Cancel',
    cancelConfirm: 'Cancel dis borrow request?',
    actionSuccess: (action) => `Request ${action}d. Bless up.`,
  },

  requests: {
    pageTitle: 'Borrow Requests',
    noIncoming: 'No incoming request.',
    noOutgoing: 'No outgoing request.',
    noHistory: 'No request history yet.',
    noMatchFilters: 'Nutten nuh match yuh filter.',
    errorLoading: (msg) => `Cyaan load requests: ${msg}`,
    requestCount: (count) =>
      `${count} request${count !== 1 ? 's' : ''}`,
    nutsCost: (amount) =>
      `${amount} nut${amount !== 1 ? 's' : ''}`,
    dueDate: (date) => `Due: ${date}`,
  },

  circles: {
    pageTitle: 'My Circles',
    newCircle: 'New Circle',
    loading: 'Loading circles...',
    errorLoading: (msg) => `Cyaan load circles: ${msg}`,
    noCirclesTitle: 'No circles yet',
    noCirclesSubtext:
      'Create a circle fi start sharing tools, or join one wid invite code.',
    createTitle: 'Create a Circle',
    createDescription:
      'A circle is a group a bredren who share tool wid each other.',
    namePlaceholder: 'e.g. Yard Tool Library',
    descriptionPlaceholder: 'Wah di circle for?',
    creating: 'Creating...',
    createButton: 'Create Circle',
    circleCreated: (name) => `"${name}" created! Big tings!`,
    backToCircles: 'Back to Circles',
    loadingCircle: 'Loading circle...',
    circleNotFound: 'Circle nuh deh yah.',
    toolsInCircle: 'Tools inna dis Circle',
    loadingTools: 'Loading tools...',
    noToolsInCircle: 'No tool listed inna dis circle yet.',
    lastAdminError:
      'Yuh is di only admin. Promote another member before yuh leave.',
    leftCircle: 'Yuh leave di circle.',
    leaving: 'Leaving...',
    leaveCircle: 'Leave Circle',
    memberCount: (count) =>
      `${count} ${count !== 1 ? 'members' : 'member'}`,
  },

  joinCircle: {
    title: 'Join a Circle',
    signInPrompt: 'Sign in fi join dis circle.',
    signInButton: 'Sign In',
    inviteCodePlaceholder: 'Paste invite code',
    circleNotFound: 'Circle nuh deh yah. Check di code an try again.',
    lookingUp: 'Looking up...',
    findCircle: 'Find Circle',
    joining: 'Joining...',
    joinButton: 'Join Circle',
    joinedCircle: (name) => `Yuh join "${name}"! Welcome to di family.`,
  },

  invite: {
    title: 'Invite Yuh People',
    copyLink: 'Copy Invite Link',
    codeCopied: 'Invite code copied!',
    linkCopied: 'Invite link copied!',
  },

  profile: {
    yourInfo: 'Yuh Info',
    savingButton: 'Saving...',
    saveChanges: 'Save Changes',
    displayNameRequired: 'Display name required.',
    profileUpdated: 'Profile updated! Yuh good.',
    avatarUpdated: 'Avatar updated! Looking fresh.',
    avatarUploadFailed: 'Avatar upload fail.',
    nutsBalance: (balance) => `Nuts Balance: ${balance}`,
    noTransactions: 'No transaction yet. Earn nuts by lending tools!',
    notificationPrefs: 'Notification Preferences',
    prefsUpdated: 'Preferences updated!',
    signOut: 'Sign Out',
    memberSince: (date) => `Member since ${date}`,
    uploadingAvatar: 'Uploading...',
  },

  search: {
    pageTitle: 'Search Tools',
    placeholder: 'Search tools across yuh circles...',
    minChars: 'Type at least 2 characters fi search.',
    searching: 'Searching...',
    noResults: (query) => `Nutten nuh deh yah fi "${query}".`,
  },

  notifications: {
    title: 'Notifications',
    markAllRead: 'Mark all read',
    empty: 'No notification yet.',
  },

  errors: {
    somethingWentWrong: 'Sumn gone wrong',
    unexpectedError:
      'Unexpected error happen. Try reload di page.',
    reloadPage: 'Reload page',
  },

  loading: 'Loading...',

  filters: {
    allStatuses: 'All statuses',
    allCategories: 'All categories',
    newestFirst: 'Newest first',
    oldestFirst: 'Oldest first',
    nameAZ: 'Name A-Z',
    nameZA: 'Name Z-A',
  },
}
