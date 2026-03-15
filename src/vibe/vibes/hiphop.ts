import type { VibeStrings } from '../types'

export const hiphop: VibeStrings = {
  landing: {
    heroTagline: 'Share tools, stack Nuts.',
    heroTitle: 'The Neighborhood Tool Connect',
    heroDescription:
      "Borrow tools from your peoples, lend yours when they're sitting idle, and keep it all balanced with Nuts — ShedShare's lending currency. No IOUs, no drama.",
    getStarted: 'Get Started Free',
    seeHowItWorks: 'See how it works',
    trustedBy: '500+ neighborhoods rocking with us',
    signUpBonus: '10 Free Nuts',
    signUpBonusSub: 'just for signing up',

    howStepCount: '4 Steps. That\'s It.',
    howTitle: 'How It Works',
    howSubtitle: 'Four moves to sharing smarter',
    steps: [
      {
        title: 'Build Your Circle',
        description:
          'Start a crew for your block, your peoples, or your co-op. Invite the ones you trust.',
      },
      {
        title: 'Add Your Tools',
        description:
          'List what you got — drills, ladders, saws, camping gear. Set your lending rules.',
      },
      {
        title: 'Browse & Borrow',
        description:
          'Need something? Search your circle. Send a request and coordinate the pickup.',
      },
      {
        title: 'Stack Nuts',
        description:
          'Lend a tool, earn a Nut. Borrow one, spend a Nut. Everybody eats, everybody wins.',
      },
    ],

    featuresLabel: 'Features',
    featuresTitle: 'Built for the Block',
    featuresSubtitle:
      'Everything you need to keep the tool game tight between friends',
    features: [
      {
        title: 'Trusted Circles',
        description:
          'Private groups for your block, your fam, or your coworkers. Only members get access.',
      },
      {
        title: 'Tool Inventory',
        description:
          "Catalog your tools with photos and details. Know what's out and what's in the shed.",
      },
      {
        title: 'Smart Search',
        description:
          'Find exactly what you need across all your circles. Filter by category, availability, distance.',
      },
      {
        title: 'Easy Requests',
        description:
          'Drop a borrow request with dates. Owner approves, you scoop it up. Clean handoff.',
      },
      {
        title: 'Nuts Economy',
        description:
          'Fair lending currency. Stack Nuts for lending, spend them to borrow. Keeps it balanced.',
      },
      {
        title: 'Notifications',
        description:
          'Stay posted on requests, approvals, and due dates. Never fumble a handoff.',
      },
    ],

    nutsTitle: 'Nuts Economy',
    nutsTitleAccent: 'Fair sharing, no cap.',
    nutsSubtitle: 'A simple currency that keeps the sharing game balanced',
    nutsItems: [
      {
        label: 'Sign Up Bonus',
        amount: '+10',
        description:
          'Every new member starts with 10 Nuts — enough to borrow right out the gate.',
      },
      {
        label: 'Lend a Tool',
        amount: '+1',
        description:
          'Every time somebody returns your tool, you stack a Nut. More you share, more you earn.',
      },
      {
        label: 'Borrow a Tool',
        amount: '-1',
        description:
          'Spending a Nut to borrow keeps it fair. No freeloaders, no awkward IOUs.',
      },
    ],

    ctaTitle: 'Ready to level up your shed game?',
    ctaSubtitle:
      "Join ShedShare today. It's free to start, and you get 10 Nuts just for showing up.",
    ctaButton: 'Get Started Free',
    footerTagline: 'Share tools, stack Nuts. Built for the block.',

    navHowItWorks: 'How It Works',
    navFeatures: 'Features',
    navSignIn: 'Sign In',
    navGetStarted: 'Get In',
  },

  auth: {
    home: 'Home',
    earlyAccess: 'Early Access',
    earlyAccessSubtext:
      'ShedShare is in early access. Sign in with an invite to get through the door.',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signInButton: 'Sign In',
    signUpButton: 'Sign Up',
    switchToSignUp: "No account? Sign Up",
    switchToSignIn: 'Already in? Sign In',
    continueWithGoogle: 'Continue with Google',
    continueWithApple: 'Continue with Apple',
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Password',
    devLabel: 'DEV',
    devLogin: 'Dev Login',
    devNotConfigured: 'Dev credentials not configured',
    or: 'OR',
  },

  dashboard: {
    greeting: (name) => `What up, ${name}.`,
    subtitle: "Here's what's moving in your shed.",
    statMyTools: 'My Tools',
    statCircles: 'Circles',
    statLentOut: 'Lent Out',
    statNuts: 'Nuts',
    pendingRequests: (count) =>
      `${count} pending request${count !== 1 ? 's' : ''}`,
    pendingSubtext: 'Somebody trying to borrow your tools',
    reviewButton: 'Review',
    recentActivity: 'Recent Activity',
    viewAll: 'View all',
    noActivity:
      'No activity yet — lend or borrow something to get this thing moving.',
    yourTools: 'Your Tools',
    noToolsTitle: 'Shed\'s empty',
    noToolsSubtext: 'Diversify your toolbox. Add your first.',
    addFirstTool: 'Add your first tool',
    yourCircles: 'Your Circles',
    noCirclesTitle: 'No circles yet',
    noCirclesSubtext: 'Create or join a circle to start sharing',
    createOrJoinCircle: 'Create or join a circle',
    quickActions: 'Quick Actions',
    addATool: 'Add a Tool',
    findATool: 'Find a Tool',
    myCircles: 'My Circles',
    wantsToBorrow: (person) => `${person} wants to borrow`,
    youRequested: 'You requested',
  },

  tools: {
    pageTitle: 'My Tools',
    addTool: 'Add Tool',
    loading: 'Loading tools...',
    errorLoading: (msg) => `Failed to load tools: ${msg}`,
    noToolsTitle: 'Toolbox empty, son',
    noToolsSubtext: 'Add your first tool to start lending to your circles.',
    addYourFirstTool: 'Add Your First Tool',
    noMatch: 'Nothing matches those filters.',
    backToMyTools: 'Back to My Tools',
    backToTool: 'Back to Tool',
    editTool: 'Edit Tool',
    addATool: 'Add a Tool',
    loadingTool: 'Loading tool...',
    toolNotFound: 'Tool not found.',
    toolDeleted: 'Tool deleted. It\'s a wrap.',
    deleteConfirm: 'You sure you want to delete this tool?',
    edit: 'Edit',
    deleting: 'Deleting...',
    delete: 'Delete',
    nutsCost: (cost) =>
      `${cost} nut${cost !== 1 ? 's' : ''} per borrow`,
    listedInCircles: (count) =>
      `Listed in ${count} circle${count !== 1 ? 's' : ''}`,
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
      'Describe your tool, condition, any extras that come with it...',
    category: 'Category',
    categoryPlaceholder: 'Pick a category',
    costLabel: 'Cost (nuts per borrow)',
    listInCircles: 'List in Circles',
    loadingForm: 'Loading form...',
    nameRequired: 'Tool name is required.',
    imageFileRequired: 'Pick an image file.',
    imageSizeLimit: 'Image gotta be under 5 MB.',
    uploadFailed: 'Photo upload failed.',
    toolAdded: 'Tool added. Nice.',
    toolUpdated: 'Tool updated. Looking clean.',
    adding: 'Adding...',
    saving: 'Saving...',
    addToolButton: 'Add Tool',
    saveChanges: 'Save Changes',
  },

  borrow: {
    borrowThisTool: 'Borrow This Tool',
    requestToBorrow: 'Request to Borrow',
    requestDescription:
      "Drop a borrow request to the owner. They'll get the notification and can approve or decline.",
    circlePlaceholder: 'Pick a circle',
    returnByLabel: 'Return by (optional)',
    messageLabel: 'Message (optional)',
    messagePlaceholder: "Yo, I need to borrow this for...",
    cancel: 'Cancel',
    sendRequest: 'Send Request',
    sending: 'Sending...',
    circleRequired: 'Pick a circle first.',
    requestSent: 'Request sent. Now we wait.',
  },

  requestActions: {
    approve: 'Approve',
    approveConfirm: 'Approve this borrow request?',
    decline: 'Decline',
    declineConfirm: 'Decline this borrow request?',
    confirmHandoff: 'Confirm Handoff',
    handoffConfirm: 'Confirm you handed off the tool?',
    confirmReturn: 'Confirm Return',
    returnConfirm: 'Confirm the tool came back safe?',
    cancelRequest: 'Cancel',
    cancelConfirm: 'Cancel this borrow request?',
    actionSuccess: (action) => `Request ${action}d. Done deal.`,
  },

  requests: {
    pageTitle: 'Borrow Requests',
    noIncoming: 'No incoming requests.',
    noOutgoing: 'No outgoing requests.',
    noHistory: 'No request history yet.',
    noMatchFilters: 'Nothing matches those filters.',
    errorLoading: (msg) => `Failed to load requests: ${msg}`,
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
    errorLoading: (msg) => `Failed to load circles: ${msg}`,
    noCirclesTitle: 'No circles yet',
    noCirclesSubtext:
      'Create a circle to start sharing tools, or join one with an invite code.',
    createTitle: 'Create a Circle',
    createDescription:
      'A circle is your crew that shares tools with each other.',
    namePlaceholder: 'e.g. Block Tool Library',
    descriptionPlaceholder: 'What\'s this circle about?',
    creating: 'Creating...',
    createButton: 'Create Circle',
    circleCreated: (name) => `"${name}" created. Let\'s go.`,
    backToCircles: 'Back to Circles',
    loadingCircle: 'Loading circle...',
    circleNotFound: 'Circle not found.',
    toolsInCircle: 'Tools in this Circle',
    loadingTools: 'Loading tools...',
    noToolsInCircle: 'No tools listed in this circle yet.',
    lastAdminError:
      'You\'re the only admin. Promote someone else before you bounce.',
    leftCircle: 'You left the circle.',
    leaving: 'Leaving...',
    leaveCircle: 'Leave Circle',
    memberCount: (count) =>
      `${count} ${count !== 1 ? 'members' : 'member'}`,
  },

  joinCircle: {
    title: 'Join a Circle',
    signInPrompt: 'Sign in to join this circle.',
    signInButton: 'Sign In',
    inviteCodePlaceholder: 'Paste invite code',
    circleNotFound: 'Circle not found. Double check that code.',
    lookingUp: 'Looking up...',
    findCircle: 'Find Circle',
    joining: 'Joining...',
    joinButton: 'Join Circle',
    joinedCircle: (name) => `You're in "${name}". Welcome to the crew.`,
  },

  invite: {
    title: 'Invite Your People',
    copyLink: 'Copy Invite Link',
    codeCopied: 'Invite code copied!',
    linkCopied: 'Invite link copied!',
  },

  profile: {
    yourInfo: 'Your Info',
    savingButton: 'Saving...',
    saveChanges: 'Save Changes',
    displayNameRequired: 'Display name is required.',
    profileUpdated: 'Profile updated. Clean.',
    avatarUpdated: 'New pic looking right.',
    avatarUploadFailed: 'Avatar upload failed.',
    nutsBalance: (balance) => `Nuts Balance: ${balance}`,
    noTransactions: 'No transactions yet. Stack Nuts by lending tools.',
    notificationPrefs: 'Notification Preferences',
    prefsUpdated: 'Preferences updated.',
    signOut: 'Sign Out',
    memberSince: (date) => `Member since ${date}`,
    uploadingAvatar: 'Uploading...',
  },

  search: {
    pageTitle: 'Search Tools',
    placeholder: 'Search tools across your circles...',
    minChars: 'Type at least 2 characters to search.',
    searching: 'Searching...',
    noResults: (query) => `Nothing found for "${query}".`,
  },

  notifications: {
    title: 'Notifications',
    markAllRead: 'Mark all read',
    empty: 'No notifications yet.',
  },

  errors: {
    somethingWentWrong: 'Something went wrong',
    unexpectedError:
      'Unexpected error. Try reloading the page.',
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
