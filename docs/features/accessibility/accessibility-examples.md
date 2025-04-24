# Accessibility Implementation Examples

This document provides practical examples of implementing accessibility features in the M-Yallow UI system. These examples are designed to help developers apply accessibility best practices consistently across the application.

## ARIA Attributes Examples

### Icon Button with Proper Accessibility

```tsx
// BAD: Icon button without accessible name
<Button variant="icon">
  <SearchIcon />
</Button>

// GOOD: Icon button with aria-label
<Button variant="icon" aria-label="Search">
  <SearchIcon />
</Button>

// BETTER: Icon button with both aria-label and sr-only text
<Button variant="icon" aria-label="Search">
  <SearchIcon />
  <span className="sr-only">Search</span>
</Button>
```

### Toggle Button States

```tsx
function ToggleButton({ isActive, label }: { isActive: boolean; label: string }) {
  return (
    <Button 
      aria-pressed={isActive} 
      onClick={() => setIsActive(!isActive)}
    >
      {label}
    </Button>
  );
}
```

### Dropdown Menu with Keyboard Navigation

```tsx
function AccessibleDropdown() {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) return;
    
    const items = Array.from(menuRef.current?.querySelectorAll('[role="menuitem"]') || []);
    const currentIndex = items.findIndex(item => item === document.activeElement);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        (items[nextIndex] as HTMLElement).focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        (items[prevIndex] as HTMLElement).focus();
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  }
  
  return (
    <div onKeyDown={handleKeyDown}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        Menu
      </button>
      {isOpen && (
        <div 
          ref={menuRef} 
          role="menu"
          tabIndex={-1}
        >
          <button role="menuitem" tabIndex={0}>Option 1</button>
          <button role="menuitem" tabIndex={0}>Option 2</button>
          <button role="menuitem" tabIndex={0}>Option 3</button>
        </div>
      )}
    </div>
  );
}
```

### Form Input with Accessibility

```tsx
function AccessibleFormField({ 
  id, 
  label, 
  required, 
  error 
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
}) {
  const errorId = error ? `${id}-error` : undefined;
  
  return (
    <div>
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
        {required && <span className="sr-only"> required</span>}
      </label>
      <input 
        id={id}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={errorId}
      />
      {error && (
        <div id={errorId} className="text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
```

## Color Contrast Examples

### Text Color Contrast

```tsx
// BAD: Low contrast text
<p className="text-gray-400">This text has poor contrast on white backgrounds.</p>

// GOOD: Sufficient contrast
<p className="text-gray-700">This text has better contrast.</p>

// BEST: Using theme variables that ensure contrast in both light and dark themes
<p className="text-foreground">This text uses theme variables for proper contrast.</p>
```

### Interactive Element Contrast

```tsx
// BAD: Button with insufficient contrast
<button className="bg-gray-200 text-gray-500">Low Contrast Button</button>

// GOOD: Button with sufficient contrast
<button className="bg-primary text-primary-foreground">High Contrast Button</button>
```

### Focus State Visibility

```tsx
// BAD: Focus state that's only indicated by outline
.button:focus {
  outline: 1px solid blue;
}

// GOOD: Clear, high contrast focus state that works in all color schemes
.button:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--ring-light);
}
```

## Keyboard Navigation Examples

### Skip Link Implementation

```tsx
// Add this at the top of your main layout component
function Layout({ children }) {
  return (
    <>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-background focus:text-foreground focus:outline-none focus:ring"
      >
        Skip to main content
      </a>
      <header>...</header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer>...</footer>
    </>
  );
}
```

### Modal Dialog with Focus Trap

```tsx
function AccessibleDialog({ isOpen, onClose, title, children }) {
  const dialogRef = useFocusTrap(isOpen);
  
  useEffect(() => {
    if (isOpen) {
      // Save the active element to restore focus later
      const activeElement = document.activeElement;
      
      // Clean up function
      return () => {
        // Restore focus when dialog closes
        if (activeElement instanceof HTMLElement) {
          activeElement.focus();
        }
      };
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={e => e.stopPropagation()}
        className="bg-background p-6 rounded-lg shadow-lg"
      >
        <h2 id="dialog-title">{title}</h2>
        {children}
        <div className="mt-4 flex justify-end">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
```

### Keyboard Accessible Tab Component

```tsx
function AccessibleTabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);
  
  function handleKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        setActiveTab((activeTab + 1) % tabs.length);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setActiveTab((activeTab - 1 + tabs.length) % tabs.length);
        break;
      case 'Home':
        e.preventDefault();
        setActiveTab(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveTab(tabs.length - 1);
        break;
    }
  }
  
  return (
    <div>
      <div 
        role="tablist" 
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            id={`tab-${index}`}
            aria-selected={index === activeTab}
            aria-controls={`panel-${index}`}
            tabIndex={index === activeTab ? 0 : -1}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div>
        {tabs.map((tab, index) => (
          <div
            key={index}
            role="tabpanel"
            id={`panel-${index}`}
            aria-labelledby={`tab-${index}`}
            hidden={index !== activeTab}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Screen Reader Compatibility Examples

### Live Region for Dynamic Content

```tsx
function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);
  
  function addNotification(message) {
    const id = Date.now();
    setNotifications([...notifications, { id, message }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(current => current.filter(n => n.id !== id));
    }, 5000);
  }
  
  return (
    <>
      <button onClick={() => addNotification("Action completed successfully")}>
        Test Notification
      </button>
      
      <div 
        aria-live="polite" 
        aria-atomic="true"
        className="fixed bottom-4 right-4 z-50"
      >
        {notifications.map(({ id, message }) => (
          <div key={id} className="bg-primary text-primary-foreground p-4 rounded mb-2">
            {message}
          </div>
        ))}
      </div>
    </>
  );
}
```

### Screen Reader Only Text

```tsx
function TableWithAccessibleCaption() {
  return (
    <div>
      <h2 id="table-title">User Data</h2>
      <p id="table-desc" className="sr-only">
        This table shows user information including name, email, and account status.
        Click on a row to view detailed user information.
      </p>
      
      <table aria-labelledby="table-title" aria-describedby="table-desc">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr tabIndex={0}>
            <td>Jane Doe</td>
            <td>jane@example.com</td>
            <td>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                Active
                <span className="sr-only"> account in good standing</span>
              </span>
            </td>
          </tr>
          {/* More rows... */}
        </tbody>
      </table>
    </div>
  );
}
```

### Accessible Icon Usage

```tsx
// BAD: Icon without accessible text
<button>
  <HeartIcon />
</button>

// GOOD: Icon with accessible text
<button>
  <HeartIcon aria-hidden="true" />
  <span>Like</span>
</button>

// ALTERNATIVE: Icon with screen reader text
<button>
  <HeartIcon aria-hidden="true" />
  <span className="sr-only">Like</span>
</button>
```

## Form Validation Examples

### Accessible Error Messages

```tsx
function AccessibleFormField({ 
  id, 
  label, 
  value,
  onChange,
  required,
  validate
}) {
  const [error, setError] = useState("");
  const errorId = error ? `${id}-error` : undefined;
  
  function handleBlur() {
    if (validate) {
      const validationError = validate(value);
      setError(validationError || "");
    }
  }
  
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block mb-1">
        {label}
        {required && <span aria-hidden="true"> *</span>}
        {required && <span className="sr-only"> required</span>}
      </label>
      
      <input 
        id={id}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={`border rounded p-2 w-full ${error ? 'border-destructive' : 'border-input'}`}
      />
      
      {error && (
        <div 
          id={errorId} 
          className="text-destructive mt-1"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}

// Usage
<AccessibleFormField
  id="email"
  label="Email Address"
  value={email}
  onChange={e => setEmail(e.target.value)}
  required
  validate={value => {
    if (!value.includes('@')) return "Please enter a valid email address";
    return "";
  }}
/>
```

## Full Page Examples

### Accessible Login Form

```tsx
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  function validateForm() {
    const errors = {};
    
    if (!email) {
      errors.email = "Email is required";
    } else if (!email.includes('@')) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      errors.password = "Password is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulated login API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitStatus({
        type: "success",
        message: "Login successful. Redirecting..."
      });
      
      // Redirect or update state
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Login failed. Please check your credentials."
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <main id="main-content" className="p-6">
      <h1>Log In to Your Account</h1>
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
          <AccessibleFormField
            id="email"
            label="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            error={formErrors.email}
          />
          
          <AccessibleFormField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            error={formErrors.password}
          />
          
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 mr-2"
            />
            <label htmlFor="remember">
              Remember me
            </label>
          </div>
          
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </div>
      </form>
      
      {submitStatus && (
        <div 
          role="alert"
          className={`mt-4 p-4 rounded ${
            submitStatus.type === "success" 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}
        >
          {submitStatus.message}
        </div>
      )}
      
      <div className="mt-6">
        <a 
          href="/reset-password"
          className="text-primary hover:underline focus:outline-none focus:ring"
        >
          Forgot password?
        </a>
      </div>
    </main>
  );
}
```

### Accessible Data Table

```tsx
function UsersTable({ users, onUserSelect }) {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  
  function handleSort(field) {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }
  
  // Sort the users
  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortField]?.toLowerCase();
    const bValue = b[sortField]?.toLowerCase();
    
    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });
  
  return (
    <div className="overflow-x-auto">
      <h2 id="users-table-title">User Data</h2>
      <p id="users-table-desc" className="sr-only">
        A sortable table of users. Click on column headers to sort. Click on a row to view user details.
      </p>
      
      <table 
        className="w-full border-collapse" 
        aria-labelledby="users-table-title"
        aria-describedby="users-table-desc"
      >
        <thead>
          <tr>
            <th scope="col">
              <button 
                onClick={() => handleSort("name")}
                className="flex items-center font-bold w-full text-left"
                aria-sort={sortField === "name" ? sortDirection : "none"}
              >
                Name
                {sortField === "name" && (
                  <span className="ml-1" aria-hidden="true">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </th>
            <th scope="col">
              <button 
                onClick={() => handleSort("email")}
                className="flex items-center font-bold w-full text-left"
                aria-sort={sortField === "email" ? sortDirection : "none"}
              >
                Email
                {sortField === "email" && (
                  <span className="ml-1" aria-hidden="true">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </th>
            <th scope="col">
              <button 
                onClick={() => handleSort("status")}
                className="flex items-center font-bold w-full text-left"
                aria-sort={sortField === "status" ? sortDirection : "none"}
              >
                Status
                {sortField === "status" && (
                  <span className="ml-1" aria-hidden="true">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map(user => (
            <tr 
              key={user.id}
              onClick={() => onUserSelect(user)}
              tabIndex={0}
              className="cursor-pointer hover:bg-accent"
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onUserSelect(user);
                }
              }}
            >
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">
                <span 
                  className={`px-2 py-1 rounded ${
                    user.status === "active" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.status === "active" ? "Active" : "Inactive"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {users.length === 0 && (
        <div className="text-center p-4 border" role="status">
          No users found
        </div>
      )}
    </div>
  );
}
```

### Accessible Navigation Menu

```tsx
function MainNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Close the mobile menu when Escape key is pressed
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);
  
  return (
    <nav aria-label="Main navigation">
      {/* Desktop Navigation */}
      <div className="hidden md:flex">
        <ul role="menubar" className="flex space-x-4">
          <li role="none">
            <a 
              href="/" 
              role="menuitem"
              className="block p-2"
              aria-current={location.pathname === "/" ? "page" : undefined}
            >
              Home
            </a>
          </li>
          <li role="none">
            <a 
              href="/products" 
              role="menuitem"
              className="block p-2"
              aria-current={location.pathname.startsWith("/products") ? "page" : undefined}
            >
              Products
            </a>
          </li>
          <li role="none">
            <a 
              href="/about" 
              role="menuitem"
              className="block p-2"
              aria-current={location.pathname === "/about" ? "page" : undefined}
            >
              About
            </a>
          </li>
          <li role="none">
            <a 
              href="/contact" 
              role="menuitem"
              className="block p-2"
              aria-current={location.pathname === "/contact" ? "page" : undefined}
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <button
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2"
        >
          {isMobileMenuOpen ? "Close" : "Menu"}
        </button>
        
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="absolute left-0 right-0 bg-background p-4 shadow-lg">
            <ul role="menu" className="space-y-2">
              <li role="none">
                <a 
                  href="/" 
                  role="menuitem"
                  className="block p-2"
                  aria-current={location.pathname === "/" ? "page" : undefined}
                >
                  Home
                </a>
              </li>
              {/* Other menu items... */}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
```

## Testing and Development Resources

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - Verify color contrast ratios
- [NVDA Screen Reader](https://www.nvaccess.org/) - Free screen reader for Windows
- [VoiceOver](https://support.apple.com/guide/voiceover/welcome/mac) - Built-in screen reader for Mac
- [axe DevTools](https://www.deque.com/axe/) - Accessibility testing browser extension
- [Accessibility Insights](https://accessibilityinsights.io/) - Comprehensive accessibility testing tools
