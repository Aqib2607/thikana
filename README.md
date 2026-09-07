# Thikana

{
"project": "Thikana",
"execution_target": "Lovable",
"phase": "Frontend Phase",
"mode": "Frontend-only implementation",
"approval_status": "Approved",
"source_of_truth": [
"Requirements Architecture Document",
"Functional Specification Document",
"Database Architecture Document",
"PRD",
"Design Document",
"Tech Stack Document",
"rule.md",
"phases.md",
"memory.md"
],
"source_references": [
"Requirements Architecture: ",
"Functional Specification: ",
"Database Architecture: ",
"PRD: ",
"Design Document: ",
"Tech Stack: ",
"Development Rules: ",
"Implementation Phases: ",
"Project Memory: "
],
"instructions": "Build the Thikana frontend according to the complete project documentation provided in the repository. This is an academic web prototype for rental property discovery in Bangladesh, with Khulna as the priority demonstration context. Implement the frontend professionally and completely, while keeping the implementation simple, maintainable, responsive, Bangla-first, and consistent with the approved architecture.",
"technology": {
"framework": "React",
"language": "TypeScript",
"build_tool": "Vite",
"routing": "React Router",
"styling": "Tailwind CSS",
"icons": "Lucide React",
"server_state": "TanStack Query where useful",
"forms": "React Hook Form where useful",
"validation": "Zod where useful",
"localization": "i18next and react-i18next",
"maps": "Leaflet and React Leaflet",
"ui_components": "Use shadcn/ui only where useful and compatible with the existing project"
},
"critical_boundary": {
"frontend_only": true,
"do_not_implement_backend_logic": true,
"do_not_create_laravel_code": true,
"do_not_create_database_migrations": true,
"do_not_modify_backend_business_logic": true,
"do_not_add_api_business_logic": true,
"api_integration": "Create clean typed API service interfaces and integration points only where needed. If the backend endpoint is unavailable, use clearly isolated mock data temporarily and make the replacement point obvious.",
"do_not_hide_backend_failures": true
},
"product_identity": {
"name": "Thikana",
"meaning": "Place or address",
"category": "Rental Property Discovery Platform",
"geographic_scope": "Bangladesh-wide",
"priority_context": "Khulna",
"primary_language": "Bangla",
"secondary_language": "English",
"primary_users": [
"Tenant",
"Landlord",
"Admin"
],
"core_user_loop": [
"Search",
"Filter",
"Match",
"Compare",
"Save",
"Contact",
"Visit"
]
},
"design_system": {
"visual_direction": [
"Modern",
"Trustworthy",
"Practical",
"Calm",
"Local",
"Human",
"Professional"
],
"avoid": [
"Generic real-estate administration dashboard",
"Generic AI dashboard aesthetic",
"Excessive gradients",
"Excessive glassmorphism",
"Heavy animations",
"Excessive shadows",
"Excessive rounded cards",
"Dark-only interface",
"Overly corporate styling",
"Unnecessary decorative illustrations",
"Dense tables for normal users",
"Fake AI aesthetics"
],
"colors": {
"primary": "#0F766E",
"secondary": "#115E59",
"accent": "#F59E0B",
"background": "#F8FAFC",
"surface": "#FFFFFF",
"text_primary": "#0F172A",
"text_secondary": "#475569",
"text_muted": "#64748B",
"success": "#16A34A",
"warning": "#D97706",
"error": "#DC2626",
"info": "#2563EB"
},
"typography": {
"primary_font": "Noto Sans Bengali",
"fallback_font": "Noto Sans",
"h1": {
"desktop": "48px",
"mobile": "32px",
"weight": 700
},
"h2": {
"desktop": "36px",
"mobile": "28px",
"weight": 700
},
"body": {
"size": "16px",
"line_height": "1.6"
}
},
"layout": {
"approach": "Mobile-first",
"content": "Centered responsive container",
"spacing": "Consistent Tailwind spacing scale",
"desktop": "Comfortable whitespace and structured grids",
"mobile": "Single-column priority layouts"
}
},
"global_ux_rules": [
"Bangla is the default language.",
"Every user-facing string must use translation keys where practical.",
"English must be available through the language switcher.",
"Every API-driven screen must have loading, success, error, and empty states where applicable.",
"Forms must show validation feedback clearly.",
"Primary actions must be visually obvious.",
"Do not hide important actions behind unnecessary menus.",
"Use semantic HTML.",
"Provide accessible labels and keyboard interaction.",
"Do not use color as the only indicator of state.",
"Use meaningful icons with Lucide React.",
"Use consistent status badges.",
"Use optimized images and appropriate aspect ratios.",
"Do not create fake functionality.",
"Do not create buttons that appear functional but do nothing.",
"Do not hardcode business records into reusable components.",
"Do not expose passwords, tokens, or sensitive information in the UI.",
"Do not add features outside the approved project scope."
],
"shared_components": [
"BrandLogo",
"Header",
"DesktopNavigation",
"MobileNavigation",
"LanguageSwitcher",
"UserMenu",
"NotificationBell",
"SearchBar",
"SearchLocationInput",
"FilterPanel",
"MobileFilterDrawer",
"SortDropdown",
"PropertyCard",
"PropertyGrid",
"PropertyList",
"PropertyImageGallery",
"PropertyStatusBadge",
"ApprovalStatusBadge",
"VerificationBadge",
"AmenityBadge",
"RatingDisplay",
"MatchScore",
"MatchExplanation",
"FavoriteButton",
"CompareButton",
"PrimaryButton",
"SecondaryButton",
"DangerButton",
"FormField",
"SelectField",
"DateField",
"TimeField",
"FileUpload",
"ImageUploader",
"Modal",
"Drawer",
"ConfirmationDialog",
"Toast",
"Alert",
"Skeleton",
"EmptyState",
"ErrorState",
"Pagination",
"DataTable",
"StatusFilter",
"MapView",
"Avatar",
"MessageBubble",
"ConversationList",
"MessageComposer",
"VisitStatusBadge",
"ReviewCard",
"ReportDialog",
"DashboardStatCard",
"PageHeader",
"Breadcrumbs"
],
"public_pages": {
"home": {
"route": "/",
"purpose": "Introduce Thikana and immediately begin rental discovery.",
"sections": [
"Header",
"Hero search section",
"Primary rental discovery CTA",
"Property type categories",
"Featured or recent properties",
"How Thikana works",
"Trust and simulated verification explanation",
"Tenant CTA",
"Landlord CTA",
"Footer"
],
"hero": {
"primary_message": "Help users find their next place quickly.",
"search_priority": [
"Location",
"Property type",
"Budget"
],
"primary_cta": "Find Properties"
}
},
"properties": {
"route": "/properties",
"purpose": "Public property discovery.",
"features": [
"Search",
"Filters",
"Sorting",
"Pagination",
"Property cards",
"Verification indicators",
"Availability indicators",
"Matching score when applicable",
"Empty state",
"Loading state",
"Error state"
],
"filters": [
"Division",
"District",
"City",
"Area",
"Property type",
"Minimum rent",
"Maximum rent",
"Rooms",
"Bathrooms",
"Available from",
"Furnished status",
"Parking",
"Balcony",
"Gas",
"Water",
"Electricity",
"Internet"
],
"sorting": [
"Relevance",
"Newest",
"Lowest rent",
"Highest rent"
],
"mobile_behavior": "Move filters into a drawer or modal."
},
"property_detail": {
"route": "/properties/:id",
"sections": [
"Image gallery",
"Property summary",
"Rent information",
"Property specifications",
"Amenities",
"Availability",
"Verification",
"Description",
"Location and map",
"Landlord information",
"Reviews",
"Community information where relevant",
"Contact action",
"Visit action",
"Favorite action",
"Compare action",
"Report action"
],
"property_information": [
"Title",
"Property type",
"Monthly rent",
"Advance",
"Additional charges",
"Rooms",
"Bathrooms",
"Floor",
"Size",
"Furnished status",
"Parking",
"Balcony",
"Electricity",
"Water",
"Gas",
"Internet",
"Availability",
"Available-from date",
"Address",
"Map location",
"Verification states",
"Listing created date",
"Listing updated date"
]
},
"login": {
"route": "/login",
"fields": [
"Email",
"Password"
],
"states": [
"Idle",
"Submitting",
"Validation error",
"Authentication error",
"Success"
]
},
"register": {
"route": "/register",
"role_selection": [
"Tenant",
"Landlord"
],
"fields": [
"Full name",
"Email",
"Phone",
"Password",
"Password confirmation",
"Terms acceptance if configured"
],
"rules": [
"Admin must not appear as a public registration option.",
"Clearly explain the difference between Tenant and Landlord registration."
]
},
"how_it_works": {
"route": "/how-it-works",
"purpose": "Explain the rental discovery workflow simply.",
"sections": [
"Search",
"Filter",
"Match",
"Compare",
"Save",
"Contact",
"Visit"
]
}
},
"tenant_pages": {
"dashboard": {
"route": "/tenant/dashboard",
"priority": "High",
"sections": [
"Welcome area",
"Rental preference summary",
"Recommended or matching properties",
"Favorites summary",
"Comparison summary",
"Contact request summary",
"Messages summary",
"Visit request summary",
"Primary CTA to find properties"
]
},
"preferences": {
"route": "/tenant/preferences",
"fields": [
"Division",
"District",
"City",
"Area",
"Property type",
"Minimum rent",
"Maximum rent",
"Minimum rooms",
"Minimum bathrooms",
"Required amenities",
"Furnished preference",
"Parking preference",
"Availability preference"
],
"behavior": [
"All fields are optional.",
"Allow save.",
"Allow update.",
"Allow clear.",
"Clearly show saved state."
]
},
"favorites": {
"route": "/tenant/favorites",
"features": [
"Saved property grid/list",
"Remove favorite",
"Open property",
"Compare",
"Availability indicator",
"Unavailable property handling",
"Empty state"
]
},
"compare": {
"route": "/tenant/compare",
"maximum_properties": 3,
"features": [
"Comparison table or responsive comparison layout",
"Property title",
"Property type",
"Rent",
"Advance",
"Additional charges",
"Rooms",
"Bathrooms",
"Size",
"Floor",
"Furnished status",
"Parking",
"Balcony",
"Gas",
"Water",
"Electricity",
"Internet",
"Availability",
"Available from",
"Verification",
"Matching score",
"Location"
],
"mobile_behavior": "Use horizontal scrolling or another clear responsive comparison pattern.",
"empty_state": "Tell the tenant how to add properties for comparison."
},
"messages": {
"route": "/tenant/messages",
"features": [
"Conversation list",
"Conversation detail",
"Message history",
"Unread state",
"Message composer",
"Loading state",
"Empty state",
"Error state"
],
"behavior": "Use standard HTTP request-based messaging. Do not design around mandatory WebSocket infrastructure."
},
"visits": {
"route": "/tenant/visits",
"features": [
"Visit request list",
"Property information",
"Preferred date",
"Preferred time",
"Optional note",
"Status",
"Cancel where permitted"
]
},
"reviews": {
"route": "/tenant/reviews",
"features": [
"Eligible properties",
"Review form",
"Rating",
"Comment",
"Existing reviews",
"Moderation state where relevant"
]
},
"profile": {
"route": "/tenant/profile",
"fields": [
"Name",
"Phone",
"Profile image if implemented",
"Preferred language"
],
"rules": [
"Tenant cannot change role."
]
}
},
"landlord_pages": {
"dashboard": {
"route": "/landlord/dashboard",
"sections": [
"Property count",
"Available property count",
"Pending approval count",
"Rented property count",
"Contact request summary",
"Visit request summary",
"Message summary",
"Primary Add Property CTA"
]
},
"properties": {
"route": "/landlord/properties",
"features": [
"Property list",
"Search",
"Status filters",
"Approval state",
"Verification state",
"Rent",
"Updated date",
"View",
"Edit",
"Change availability",
"Deactivate",
"Resubmit rejected listing"
]
},
"create_property": {
"route": "/landlord/properties/create",
"form_sections": [
"Basic information",
"Rental information",
"Physical information",
"Utilities",
"Location",
"Media"
],
"fields": [
"Title",
"Property type",
"Description",
"Available from",
"Monthly rent",
"Advance",
"Additional charges",
"Rooms",
"Bathrooms",
"Floor",
"Total floors",
"Size",
"Furnished status",
"Parking",
"Balcony",
"Electricity",
"Water",
"Gas",
"Internet",
"Division",
"District",
"City",
"Area",
"Address",
"Latitude",
"Longitude",
"Main image",
"Additional images"
],
"ui_requirements": [
"Use clear grouped sections.",
"Show required fields clearly.",
"Provide image previews.",
"Provide upload validation feedback.",
"Prevent accidental duplicate submission.",
"Show save/submit loading states.",
"Keep the form usable on mobile."
]
},
"edit_property": {
"route": "/landlord/properties/:id/edit",
"behavior": [
"Prefill existing values.",
"Allow editing property information.",
"Allow editing amenities.",
"Allow editing location.",
"Allow editing images.",
"Allow editing availability.",
"Show approval status.",
"Show verification indicators."
]
},
"requests": {
"route": "/landlord/requests",
"features": [
"Contact requests",
"Tenant summary",
"Property summary",
"Request date",
"Status",
"Accept",
"Decline"
]
},
"messages": {
"route": "/landlord/messages",
"features": [
"Conversation list",
"Conversation detail",
"Message history",
"Unread indicators",
"Message composer"
]
},
"visits": {
"route": "/landlord/visits",
"features": [
"Visit requests",
"Tenant information",
"Property",
"Date",
"Time",
"Note",
"Accept",
"Reject",
"Status"
]
},
"profile": {
"route": "/landlord/profile",
"fields": [
"Name",
"Phone",
"Profile information",
"Preferred language"
],
"rules": [
"Landlord cannot change role."
]
}
},
"admin_pages": {
"dashboard": {
"route": "/admin/dashboard",
"stat_cards": [
"Total tenants",
"Total landlords",
"Total users",
"Total properties",
"Pending approvals",
"Available properties",
"Rented properties",
"Reports",
"Reviews",
"Verification items"
],
"sections": [
"Overview",
"Pending approvals",
"Recent reports",
"Verification summary",
"Basic analytics"
]
},
"users": {
"route": "/admin/users",
"features": [
"Search",
"Role filter",
"Status filter",
"Name",
"Email",
"Phone",
"Role",
"Account status",
"View profile",
"Change status"
],
"security": [
"Never display passwords.",
"Do not display password hashes."
]
},
"properties": {
"route": "/admin/properties",
"features": [
"Search",
"Filters",
"Property details",
"Owner",
"Approval state",
"Availability",
"Verification",
"Reports",
"Deactivate where authorized"
]
},
"approvals": {
"route": "/admin/approvals",
"features": [
"Pending property list",
"Property detail review",
"Images",
"Location",
"Owner information",
"Approve",
"Reject",
"Rejection reason"
]
},
"verification": {
"route": "/admin/verification",
"verification_types": [
"Owner identity",
"Phone",
"Availability",
"Documents"
],
"statuses": [
"Pending",
"Verified",
"Rejected"
],
"ui_requirement": "Clearly label verification as Thikana platform verification. Never imply government certification."
},
"reports": {
"route": "/admin/reports",
"features": [
"Report list",
"Reporter",
"Property",
"Reason",
"Description",
"Status",
"Review",
"Resolve",
"Reject"
],
"statuses": [
"Open",
"Under Review",
"Resolved",
"Rejected"
]
},
"reviews": {
"route": "/admin/reviews",
"features": [
"Review list",
"Property",
"Tenant",
"Rating",
"Comment",
"Moderation state",
"Approve/hide/remove according to available backend contract"
]
},
"community": {
"route": "/admin/community",
"features": [
"Structured community information",
"Category",
"Area",
"Submitted by",
"Moderation state",
"Approve/hide/manage"
],
"categories": [
"Transport",
"Waterlogging",
"Internet",
"Noise",
"Safety",
"General"
]
},
"analytics": {
"route": "/admin/analytics",
"features": [
"Users by role",
"Properties by type",
"Properties by location",
"Properties by status",
"Verification summary",
"Contact request count",
"Visit request count",
"Review count"
],
"design": "Use simple academic-friendly charts and summary cards. Do not create an excessive analytics dashboard."
},
"audit_logs": {
"route": "/admin/audit-logs",
"features": [
"Actor",
"Action",
"Entity type",
"Entity ID",
"Timestamp",
"Previous state where available",
"New state where available",
"Reason where available"
]
}
},
"navigation": {
"public": [
"Home",
"Browse Properties",
"How It Works",
"Login",
"Register",
"Language Switcher"
],
"tenant": [
"Dashboard",
"Find Properties",
"Favorites",
"Compare",
"Messages",
"Visits",
"Reviews",
"Profile"
],
"landlord": [
"Dashboard",
"My Properties",
"Add Property",
"Requests",
"Messages",
"Visits",
"Profile"
],
"admin": [
"Dashboard",
"Users",
"Properties",
"Approvals",
"Verification",
"Reports",
"Reviews",
"Community",
"Analytics",
"Audit Logs"
]
},
"responsive_rules": {
"mobile": [
"Prioritize primary actions.",
"Use a compact header.",
"Use mobile navigation.",
"Move property filters into a drawer or modal.",
"Stack property cards vertically.",
"Use full-width form controls.",
"Keep message bubbles readable.",
"Use horizontal scrolling for comparison where appropriate.",
"Keep maps usable.",
"Avoid desktop-only hover interactions."
],
"tablet": [
"Use two-column layouts where appropriate.",
"Maintain comfortable touch targets.",
"Keep filters accessible."
],
"desktop": [
"Use structured multi-column layouts.",
"Use side filters where appropriate.",
"Use spacious property grids.",
"Use dashboard side navigation."
]
},
"property_card_specification": {
"required": [
"Main image",
"Property title",
"Location",
"Rent",
"Property type",
"Rooms",
"Bathrooms",
"Key amenities",
"Availability",
"Verification badge",
"Matching score where preferences exist",
"Favorite control",
"Compare control"
],
"behavior": [
"Card links to property detail.",
"Favorite action must not accidentally open the property.",
"Compare action must not accidentally open the property.",
"Unavailable properties must be visually clear.",
"Do not invent missing property information."
]
},
"matching_ui": {
"score": "Display as a clear 0 to 100 percent score.",
"weights": {
"location": 30,
"budget": 25,
"property_type": 15,
"room_bathroom": 10,
"amenities": 15,
"availability": 5
},
"explanation": "Show understandable reasons based on actual returned scoring factors.",
"prohibited_copy": [
"AI predicts this property is perfect for you.",
"AI recommendation.",
"Machine learning prediction."
]
},
"verification_ui": {
"label": "Verified on Thikana",
"types": [
"Owner Identity",
"Phone",
"Availability",
"Documents"
],
"important_behavior": "The UI must clearly communicate that verification is simulated/platform-level verification for the academic prototype and does not represent government-certified identity or ownership verification."
},
"property_status_ui": {
"availability_statuses": [
"Available",
"Reserved",
"Rented",
"Temporarily Unavailable",
"Inactive"
],
"approval_statuses": [
"Draft",
"Submitted",
"Approved",
"Rejected"
],
"rule": "Keep approval status and availability status visually and logically separate."
},
"form_validation": {
"frontend_purpose": "Improve user experience only.",
"required": [
"Required fields",
"Email format",
"Phone format",
"Password confirmation",
"Numeric ranges",
"Date validity",
"File type",
"File size"
],
"rules": [
"Trim string values.",
"Reject negative rent.",
"Reject invalid room/bathroom values.",
"Reject invalid dates.",
"Reject invalid image files.",
"Prevent repeated form submission while submitting."
]
},
"state_management": {
"local_state": [
"Modal state",
"Drawer state",
"Temporary form state",
"Temporary filter state"
],
"shared_state": [
"Authentication state",
"Language",
"Comparison selection",
"Important notification state"
],
"server_state": [
"Properties",
"User profile",
"Favorites",
"Preferences",
"Contact requests",
"Conversations",
"Messages",
"Visit requests",
"Reviews",
"Verification",
"Reports",
"Notifications"
],
"rule": "Do not introduce Redux unless the existing application genuinely requires it."
},
"api_integration_architecture": {
"style": "REST",
"base_path": "/api/v1",
"frontend_requirements": [
"Create typed API service functions.",
"Keep API calls outside presentation components where practical.",
"Define TypeScript types for API responses.",
"Handle 401, 403, 404, 422, and 500 states.",
"Do not create random response transformations to hide API contract mismatches.",
"Keep backend-specific implementation out of frontend components."
],
"expected_resources": [
"auth",
"users",
"properties",
"property-images",
"property-types",
"amenities",
"locations",
"preferences",
"favorites",
"comparisons",
"contact-requests",
"conversations",
"messages",
"visits",
"reviews",
"verification",
"community",
"reports",
"notifications",
"audit-logs"
]
},
"mock_data_policy": {
"allowed": true,
"purpose": "Allow frontend development before backend endpoints are available.",
"rules": [
"Keep mock data isolated in a dedicated development/mock layer.",
"Use realistic Bangladesh-focused demo data, especially Khulna.",
"Do not permanently hide backend failures with mock data.",
"Do not hardcode mock data inside reusable UI components.",
"Make it easy to replace mock services with real API services."
],
"demo_property_examples": [
"2-bedroom flat in Khulna",
"Bachelor room in Khulna",
"Sublet near a university area",
"Family apartment",
"House rental",
"Office/commercial rental"
]
},
"localization": {
"default": "bn",
"supported": [
"bn",
"en"
],
"requirements": [
"Use translation keys.",
"Translate navigation.",
"Translate buttons.",
"Translate labels.",
"Translate validation messages.",
"Translate status labels.",
"Translate notifications.",
"Translate empty states.",
"Translate error states.",
"Translate dashboard content.",
"Do not duplicate language strings directly throughout components."
]
},
"accessibility": {
"requirements": [
"Semantic HTML.",
"Proper form labels.",
"Keyboard navigation.",
"Visible focus states.",
"Accessible buttons.",
"Alt text for property images.",
"Accessible dialogs and drawers.",
"Sufficient color contrast.",
"Do not use color as the only status indicator.",
"Respect reduced-motion preferences where animations are used."
]
},
"performance": {
"requirements": [
"Lazy-load heavy pages where useful.",
"Optimize images.",
"Use pagination.",
"Use query caching where appropriate.",
"Avoid unnecessary API requests.",
"Avoid unnecessary rerenders.",
"Avoid excessive animations.",
"Do not render unlimited property records."
]
},
"seo": {
"scope": "Basic SPA SEO only.",
"requirements": [
"Meaningful page titles.",
"Meta descriptions for public pages where practical.",
"Semantic headings.",
"Semantic HTML.",
"Do not introduce SSR solely for SEO."
]
},
"security_frontend": {
"requirements": [
"Never store backend secrets in frontend code.",
"Never expose passwords or password hashes.",
"Do not hardcode API keys unless explicitly public and required.",
"Do not trust frontend role visibility as authorization.",
"Treat frontend authorization as UX only.",
"Handle unauthorized responses cleanly.",
"Do not display internal server errors.",
"Do not expose stack traces."
]
},
"out_of_scope": [
"Payment gateway",
"Rent collection",
"Security deposit transactions",
"SMS gateway",
"Real phone OTP infrastructure",
"Government NID verification",
"Government ownership verification",
"Legal document verification",
"AI/ML recommendation",
"Advanced routing",
"Mobile application",
"Broker accounts",
"Commission management",
"Escrow",
"Digital tenancy agreement execution",
"Real-time location tracking",
"Video calling",
"Large-scale distributed infrastructure",
"WebSocket-dependent architecture",
"Redis",
"Elasticsearch",
"GraphQL",
"Microservices",
"Kubernetes"
],
"implementation_order": [
{
"phase": "Frontend Foundation",
"tasks": [
"Inspect existing repository.",
"Preserve existing working configuration.",
"Configure React and TypeScript structure.",
"Configure Tailwind.",
"Configure routing.",
"Configure localization.",
"Create design tokens.",
"Create reusable UI primitives.",
"Create shared layouts.",
"Create responsive navigation."
]
},
{
"phase": "Public Experience",
"tasks": [
"Home",
"Browse Properties",
"Property Detail",
"How It Works",
"Login",
"Register"
]
},
{
"phase": "Tenant Experience",
"tasks": [
"Tenant layout",
"Tenant dashboard",
"Preferences",
"Favorites",
"Comparison",
"Messages",
"Visits",
"Reviews",
"Profile"
]
},
{
"phase": "Landlord Experience",
"tasks": [
"Landlord layout",
"Landlord dashboard",
"Property management",
"Create property",
"Edit property",
"Requests",
"Messages",
"Visits",
"Profile"
]
},
{
"phase": "Admin Experience",
"tasks": [
"Admin layout",
"Admin dashboard",
"Users",
"Properties",
"Approvals",
"Verification",
"Reports",
"Reviews",
"Community",
"Analytics",
"Audit logs"
]
},
{
"phase": "Integration Preparation",
"tasks": [
"Create typed API service layer.",
"Create query hooks where useful.",
"Create mutation hooks where useful.",
"Create loading/error/empty states.",
"Create authentication integration points.",
"Create role-aware route guards.",
"Create map integration component.",
"Create file upload integration component."
]
},
{
"phase": "Frontend QA",
"tasks": [
"Run the application.",
"Test every public route.",
"Test every tenant route.",
"Test every landlord route.",
"Test every admin route.",
"Test forms.",
"Test navigation.",
"Test language switching.",
"Test mobile layout.",
"Test tablet layout.",
"Test desktop layout.",
"Inspect browser console.",
"Inspect network requests.",
"Check broken assets.",
"Check loading states.",
"Check empty states.",
"Check error states.",
"Run frontend tests.",
"Run production build."
]
}
],
"route_protection": {
"public": [
"/",
"/properties",
"/properties/:id",
"/login",
"/register",
"/how-it-works"
],
"tenant": [
"/tenant/"
],
"landlord": [
"/landlord/"
],
"admin": [
"/admin/*"
],
"behavior": [
"Unauthenticated users attempting protected routes should be redirected to login.",
"Authenticated users attempting the wrong role area should see an access-denied state or be redirected appropriately.",
"Do not rely on route hiding alone for security.",
"Frontend route guards are for user experience. Backend authorization remains authoritative."
]
},
"quality_gate": {
"must_pass": [
"No critical TypeScript errors.",
"No critical React runtime errors.",
"No broken routes.",
"No broken navigation.",
"No critical console errors.",
"No unhandled promise rejections.",
"No obvious network contract errors.",
"No broken responsive layouts.",
"No fake buttons.",
"No missing primary states.",
"No exposed secrets.",
"Bangla interface works.",
"English interface works.",
"Frontend production build succeeds."
]
},
"testing": {
"stack": [
"Vitest",
"React Testing Library"
],
"minimum_tests": [
"Login form validation",
"Registration role selection",
"Property card rendering",
"Property filtering UI",
"Favorite interaction",
"Comparison limit of 3",
"Matching score display",
"Language switching",
"Protected route behavior",
"Tenant navigation",
"Landlord navigation",
"Admin navigation"
]
},
"code_quality": {
"requirements": [
"Use TypeScript types.",
"Avoid any.",
"Use functional React components.",
"Keep components focused.",
"Create reusable components for repeated UI.",
"Do not create unnecessary abstractions.",
"Keep API services separate from presentation.",
"Keep business rules out of UI components.",
"Use meaningful names.",
"Avoid giant components.",
"Avoid duplicate interfaces.",
"Preserve existing working code."
]
},
"dependency_governance": {
"rule": "Do not install dependencies unless necessary.",
"preferred": [
"React",
"TypeScript",
"Vite",
"React Router",
"Tailwind CSS",
"Lucide React",
"TanStack Query",
"React Hook Form",
"Zod",
"i18next",
"react-i18next",
"Leaflet",
"React Leaflet"
],
"before_install": [
"Check whether the current project already includes the package.",
"Check whether the framework already provides the functionality.",
"Avoid duplicate libraries.",
"Avoid adding dependencies only for visual effects."
]
},
"git_rules": {
"branch": "agent/thikana",
"commit_format": "agent: ",
"do_not_commit": [
".env",
"Secrets",
"Temporary debug files",
"Unnecessary build artifacts"
]
},
"execution_rules": {
"do_not": [
"Rewrite unrelated working modules.",
"Change the approved technology stack.",
"Change user roles.",
"Change the matching algorithm.",
"Add backend architecture.",
"Add production infrastructure.",
"Add future-phase features beyond frontend dependencies required for the current UI.",
"Invent undocumented business rules.",
"Replace the approved design with a generic template."
],
"if_existing_code_exists": [
"Inspect it first.",
"Reuse compatible components.",
"Preserve working functionality.",
"Modify the smallest reasonable surface.",
"Do not rebuild the project from scratch without a technical reason."
],
"if_requirement_is_ambiguous": [
"Choose the simplest interpretation consistent with the documents.",
"Do not make a major product or architectural decision silently."
]
},
"final_deliverables": [
"Complete responsive React frontend",
"Public pages",
"Tenant pages",
"Landlord pages",
"Admin pages",
"Shared component system",
"Responsive layouts",
"Bangla-first localization",
"English localization",
"Typed frontend models",
"Typed API service layer",
"Route protection",
"Loading states",
"Empty states",
"Error states",
"Form validation",
"Property discovery UI",
"Property detail UI",
"Property creation/editing UI",
"Matching UI",
"Comparison UI",
"Favorites UI",
"Contact request UI",
"Messaging UI",
"Visit UI",
"Verification UI",
"Review UI",
"Community UI",
"Reporting UI",
"Admin management UI",
"Map component",
"Image upload component",
"Frontend tests",
"Successful production build"
],
"completion_report_required": {
"format": [
"Completed",
"Files Changed",
"Components Created",
"Routes Created",
"Tests Performed",
"Browser Validation",
"Console Errors",
"Network Errors",
"Build Result",
"Remaining Frontend Issues",
"Backend Integration Dependencies"
],
"rule": "Do not claim the frontend is complete without running and validating the application."
}
}

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bdb68722-393c-4818-9789-7c0d66f331f4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
