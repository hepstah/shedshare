import type { VibeStrings } from '../types'

export const standard: VibeStrings = {
  landing: {
    heroTagline: 'Share tools, not expenses.',
    heroTitle: 'Your Neighborhood Tool Library',
    heroDescription:
      "Borrow tools from your friends, lend yours when you're not using them, and keep track of it all with Nuts — ShedShare's friendly lending currency.",
    getStarted: 'Get Started Free',
    seeHowItWorks: 'See how it works',
    trustedBy: 'Trusted by 500+ neighborhoods',
    signUpBonus: '10 Free Nuts',
    signUpBonusSub: 'when you sign up',

    howStepCount: '4 Simple Steps',
    howTitle: 'How It Works',
    howSubtitle: 'Four steps to sharing smarter',
    steps: [
      {
        title: 'Create a Circle',
        description:
          'Start a group for your neighborhood, friend circle, or co-op. Invite people you trust.',
      },
      {
        title: 'Add Your Tools',
        description:
          'List what you own — drills, ladders, saws, camping gear. Set your lending preferences.',
      },
      {
        title: 'Browse & Borrow',
        description:
          'Need something? Search your circle. Send a request and coordinate pickup.',
      },
      {
        title: 'Earn Nuts',
        description:
          'Lend a tool, earn a Nut. Borrow one, spend a Nut. Everyone contributes, everyone benefits.',
      },
    ],

    featuresLabel: 'Features',
    featuresTitle: 'Built for Real Neighbors',
    featuresSubtitle:
      'Everything you need for real-world tool sharing between friends',
    features: [
      {
        title: 'Trusted Circles',
        description:
          'Create private groups for your neighborhood, family, or co-workers. Only members can see and borrow.',
      },
      {
        title: 'Tool Inventory',
        description:
          'Catalog your tools with photos and details. Track what\'s lent out and what\'s available.',
      },
      {
        title: 'Smart Search',
        description:
          'Find exactly what you need across all your circles. Filter by category, availability, and distance.',
      },
      {
        title: 'Easy Requests',
        description:
          'Send borrow requests with dates. Owners approve, you pick up. Simple handoff flow.',
      },
      {
        title: 'Nuts Economy',
        description:
          'A fair lending currency. Earn Nuts for lending, spend them to borrow. Keeps things balanced.',
      },
      {
        title: 'Notifications',
        description:
          'Get notified about requests, approvals, and due dates. Never miss a handoff.',
      },
    ],

    nutsTitle: 'Nuts Economy',
    nutsTitleAccent: 'Fair sharing, built in.',
    nutsSubtitle: 'A simple currency that keeps sharing balanced',
    nutsItems: [
      {
        label: 'Sign Up Bonus',
        amount: '+10',
        description:
          'Every new member starts with 10 Nuts — enough to borrow right away.',
      },
      {
        label: 'Lend a Tool',
        amount: '+1',
        description:
          'Each time someone returns your tool, you earn a Nut. The more you share, the more you earn.',
      },
      {
        label: 'Borrow a Tool',
        amount: '-1',
        description:
          'Spending a Nut to borrow keeps things fair. No free-riders, no awkward IOUs.',
      },
    ],

    ctaTitle: 'Ready to share smarter?',
    ctaSubtitle:
      "Join ShedShare today. It's free to start, and you'll get 10 Nuts just for signing up.",
    ctaButton: 'Get Started Free',
    footerTagline: 'Share tools, not expenses. Built for real neighbors.',

    navHowItWorks: 'How It Works',
    navFeatures: 'Features',
    navSignIn: 'Sign In',
    navGetStarted: 'Get Started',
  },

  auth: {
    home: 'Home',
    earlyAccess: 'Early Access',
    earlyAccessSubtext:
      'ShedShare is in early access. Sign in with an invite to get started.',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signInButton: 'Sign In',
    signUpButton: 'Sign Up',
    switchToSignUp: "Don't have an account? Sign Up",
    switchToSignIn: 'Already have an account? Sign In',
    continueWithGoogle: 'Continue with Google',
    continueWithApple: 'Continue with Apple',
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Password',
    devLabel: 'DEV',
    devLogin: 'Dev Login',
    devNotConfigured: 'Dev credentials not configured in environment',
    or: 'OR',
  },

  dashboard: {
    greeting: (name) => `Hey, ${name}!`,
    subtitle: "Here's what's happening in your shed.",
    statMyTools: 'My Tools',
    statCircles: 'Circles',
    statLentOut: 'Lent Out',
    statNuts: 'Nuts',
    pendingRequests: (count) =>
      `${count} pending request${count !== 1 ? 's' : ''}`,
    pendingSubtext: 'Someone wants to borrow your tools',
    reviewButton: 'Review',
    recentActivity: 'Recent Activity',
    viewAll: 'View all',
    noActivity:
      'No activity yet — lend or borrow a tool to get started!',
    yourTools: 'Your Tools',
    noToolsTitle: 'No tools yet',
    noToolsSubtext: 'Share your first tool with your circles',
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
    noToolsTitle: 'No tools yet',
    noToolsSubtext:
      'Add your first tool to start lending to your circles.',
    addYourFirstTool: 'Add Your First Tool',
    noMatch: 'No tools match your filters.',
    backToMyTools: 'Back to My Tools',
    backToTool: 'Back to Tool',
    editTool: 'Edit Tool',
    addATool: 'Add a Tool',
    loadingTool: 'Loading tool...',
    toolNotFound: 'Tool not found.',
    toolDeleted: 'Tool deleted.',
    deleteConfirm: 'Are you sure you want to delete this tool?',
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
      'Describe your tool, condition, any accessories included...',
    category: 'Category',
    categoryPlaceholder: 'Select a category',
    costLabel: 'Cost (nuts per borrow)',
    listInCircles: 'List in Circles',
    loadingForm: 'Loading form...',
    nameRequired: 'Tool name is required.',
    imageFileRequired: 'Please select an image file.',
    imageSizeLimit: 'Image must be under 5 MB.',
    uploadFailed: 'Failed to upload photo.',
    toolAdded: 'Tool added!',
    toolUpdated: 'Tool updated!',
    adding: 'Adding...',
    saving: 'Saving...',
    addToolButton: 'Add Tool',
    saveChanges: 'Save Changes',
  },

  borrow: {
    borrowThisTool: 'Borrow This Tool',
    requestToBorrow: 'Request to Borrow',
    requestDescription:
      "Send a borrow request to the owner. They'll be notified and can approve or decline.",
    circlePlaceholder: 'Select a circle',
    returnByLabel: 'Return by (optional)',
    messageLabel: 'Message (optional)',
    messagePlaceholder: "Hi! I'd like to borrow this for...",
    cancel: 'Cancel',
    sendRequest: 'Send Request',
    sending: 'Sending...',
    circleRequired: 'Please select a circle.',
    requestSent: 'Borrow request sent!',
  },

  requestActions: {
    approve: 'Approve',
    approveConfirm: 'Approve this borrow request?',
    decline: 'Decline',
    declineConfirm: 'Decline this borrow request?',
    confirmHandoff: 'Confirm Handoff',
    handoffConfirm: 'Confirm you handed off the tool?',
    confirmReturn: 'Confirm Return',
    returnConfirm: 'Confirm the tool has been returned?',
    cancelRequest: 'Cancel',
    cancelConfirm: 'Cancel this borrow request?',
    actionSuccess: (action) => `Request ${action}d.`,
  },

  requests: {
    pageTitle: 'Borrow Requests',
    noIncoming: 'No incoming requests.',
    noOutgoing: 'No outgoing requests.',
    noHistory: 'No request history yet.',
    noMatchFilters: 'No requests match your filters.',
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
      'A circle is a group of friends who share tools with each other.',
    namePlaceholder: 'e.g. Neighborhood Tool Library',
    descriptionPlaceholder: 'What is this circle for?',
    creating: 'Creating...',
    createButton: 'Create Circle',
    circleCreated: (name) => `"${name}" created!`,
    backToCircles: 'Back to Circles',
    loadingCircle: 'Loading circle...',
    circleNotFound: 'Circle not found.',
    toolsInCircle: 'Tools in this Circle',
    loadingTools: 'Loading tools...',
    noToolsInCircle: 'No tools listed in this circle yet.',
    lastAdminError:
      'You are the only admin. Promote another member before leaving.',
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
    circleNotFound: 'Circle not found. Check the code and try again.',
    lookingUp: 'Looking up...',
    findCircle: 'Find Circle',
    joining: 'Joining...',
    joinButton: 'Join Circle',
    joinedCircle: (name) => `Joined "${name}"!`,
  },

  invite: {
    title: 'Invite Friends',
    copyLink: 'Copy Invite Link',
    codeCopied: 'Invite code copied!',
    linkCopied: 'Invite link copied!',
  },

  profile: {
    yourInfo: 'Your Info',
    savingButton: 'Saving...',
    saveChanges: 'Save Changes',
    displayNameRequired: 'Display name is required.',
    profileUpdated: 'Profile updated!',
    avatarUpdated: 'Avatar updated!',
    avatarUploadFailed: 'Failed to upload avatar.',
    nutsBalance: (balance) => `Nuts Balance: ${balance}`,
    noTransactions: 'No transactions yet. Earn nuts by lending tools!',
    notificationPrefs: 'Notification Preferences',
    prefsUpdated: 'Preferences updated!',
    signOut: 'Sign Out',
    memberSince: (date) => `Member since ${date}`,
    uploadingAvatar: 'Uploading...',
  },

  search: {
    pageTitle: 'Search Tools',
    placeholder: 'Search tools across your circles...',
    minChars: 'Type at least 2 characters to search.',
    searching: 'Searching...',
    noResults: (query) => `No tools found for "${query}".`,
  },

  notifications: {
    title: 'Notifications',
    markAllRead: 'Mark all read',
    empty: 'No notifications yet.',
  },

  errors: {
    somethingWentWrong: 'Something went wrong',
    unexpectedError:
      'An unexpected error occurred. Please try reloading the page.',
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
