(() => {
  "use strict";

  const STORAGE_KEYS = {
    profile: "waypointEmployerProfile",
    teamMembers: "waypointTeamMembers",
    settings: "waypointEmployerSettings",
    notifications: "waypointNotifications"
  };

  const defaultProfile = {
    name: "Jhansi",
    companyName: "Waypoint Hiring Solutions",
    role: "Employer / Hiring Manager",
    email: "jhansi@waypointhire.com",
    phone: "+1 (512) 555-0148",
    website: "www.waypointhire.com",
    location: "Austin, Texas, USA",
    industry: "Technology, Information Services",
    companySize: "51–200 employees",
    founded: "2019",
    timezone: "Central Time (CT)",
    about:
      "Waypoint Hiring Solutions helps organizations connect with qualified talent through smart hiring workflows, local reach, and event-driven engagement.",
    hiringFocus: [
      "Software Engineering",
      "QA Automation",
      "Data & AI",
      "DevOps",
      "Full Stack",
      "Event Hiring"
    ],
    workTypes: "Remote, Hybrid, On-site",
    preferredLocations:
      "Austin, TX · Remote (US) · Bangalore, IN",
    interviewMode: "Video · In-person · On-site",
    hiringVolume: "11–25 hires per quarter",
    linkedin:
      "linkedin.com/company/waypoint-hiring",
    twitter: "x.com/waypointhire",
    facebook: "facebook.com/waypointhire"
  };

  const defaultTeamMembers = [
    {
      id: 1,
      name: "Jhansi",
      email: "jhansi@waypointhire.com",
      role: "Employer / Owner",
      access: "Owner"
    },
    {
      id: 2,
      name: "Ramesh Kumar",
      email: "ramesh@waypointhire.com",
      role: "Recruiter",
      access: "Admin"
    },
    {
      id: 3,
      name: "Sneha Patel",
      email: "sneha@waypointhire.com",
      role: "Talent Sourcer",
      access: "Member"
    }
  ];

  const defaultSettings = {
    emailNotifications: true,
    applicantNotifications: true,
    eventReminders: true,
    marketingEmails: false,
    twoFactorAuthentication: false,
    loginAlerts: true,
    profileVisibility: true,
    dataSharing: false,
    theme: "Light",
    language: "English",
    timezone: "Central Time (CT)"
  };

  const defaultNotifications = [
    {
      id: 1,
      title: "New applicant received",
      message:
        "A candidate applied for your recent job posting.",
      read: false
    },
    {
      id: 2,
      title: "Upcoming hiring event",
      message:
        "Your scheduled hiring event begins tomorrow.",
      read: false
    }
  ];

  const performanceData = [
    {
      value: 24,
      label: "Jobs Posted",
      icon: "▣"
    },
    {
      value: 8,
      label: "Events Scheduled",
      icon: "□"
    },
    {
      value: 16,
      label: "Employees Hired",
      icon: "♙"
    }
  ];

  let profile = loadData(
    STORAGE_KEYS.profile,
    defaultProfile
  );

  let teamMembers = loadData(
    STORAGE_KEYS.teamMembers,
    defaultTeamMembers
  );

  let settings = loadData(
    STORAGE_KEYS.settings,
    defaultSettings
  );

  let notifications = loadData(
    STORAGE_KEYS.notifications,
    defaultNotifications
  );

  const pages = {
    home: document.getElementById("homePage"),
    profile: document.getElementById("profilePage"),
    settings: document.getElementById("settingsPage"),
    placeholder:
      document.getElementById("placeholderPage")
  };

  const accountButton =
    document.getElementById("accountButton");

  const accountMenu =
    document.getElementById("accountMenu");

  const notificationButton =
    document.getElementById("notificationButton");

  const notificationPanel =
    document.getElementById("notificationPanel");

  const notificationBadge =
    document.getElementById("notificationBadge");

  const notificationList =
    document.getElementById("notificationList");

  const markAllReadButton =
    document.getElementById("markAllRead");

  const logoutButton =
    document.getElementById("logoutButton");

  const homeStats =
    document.getElementById("homeStats");

  const performanceStats =
    document.getElementById("performanceStats");

  const profileOverview =
    document.getElementById("profileOverview");

  const hiringFocusCard =
    document.getElementById("hiringFocusCard");

  const socialCard =
    document.getElementById("socialCard");

  const teamCard =
    document.getElementById("teamCard");

  const workplaceCard =
    document.getElementById("workplaceCard");

  const activityCard =
    document.getElementById("activityCard");

  const editProfileButton =
    document.getElementById("editProfileButton");

  const profileModal =
    document.getElementById("profileModal");

  const profileForm =
    document.getElementById("profileForm");

  const closeModalButton =
    document.getElementById("closeModal");

  const cancelModalButton =
    document.getElementById("cancelModal");

  const inviteTeamModal =
    document.getElementById("inviteTeamModal");

  const inviteTeamForm =
    document.getElementById("inviteTeamForm");

  const closeInviteTeamModalButton =
    document.getElementById(
      "closeInviteTeamModal"
    );

  const cancelInviteTeamButton =
    document.getElementById(
      "cancelInviteTeam"
    );

  const inviteMessage =
    document.getElementById("inviteMessage");

  const sendInvitationButton =
    document.getElementById(
      "sendInvitationButton"
    );

  const confirmationModal =
    document.getElementById(
      "confirmationModal"
    );

  const confirmationMessage =
    document.getElementById(
      "confirmationMessage"
    );

  const closeConfirmationModalButton =
    document.getElementById(
      "closeConfirmationModal"
    );

  const settingsContent =
    document.getElementById("settingsContent");

  const placeholderTitle =
    document.getElementById("placeholderTitle");

  const toast =
    document.getElementById("toast");

  function loadData(key, fallback) {
    try {
      const saved = localStorage.getItem(key);

      return saved
        ? JSON.parse(saved)
        : structuredClone(fallback);
    } catch (error) {
      console.error(
        `Unable to load ${key}:`,
        error
      );

      return structuredClone(fallback);
    }
  }

  function saveData(key, value) {
    try {
      localStorage.setItem(
        key,
        JSON.stringify(value)
      );
    } catch (error) {
      console.error(
        `Unable to save ${key}:`,
        error
      );

      showToast(
        "Unable to save changes.",
        true
      );
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getInitials(name) {
    return String(name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function normalizeUrl(value) {
    const url = String(value || "").trim();

    if (!url) {
      return "#";
    }

    return /^https?:\/\//i.test(url)
      ? url
      : `https://${url}`;
  }

  function showToast(
    message,
    isError = false
  ) {
    if (!toast) {
      alert(message);
      return;
    }

    toast.textContent = message;
    toast.classList.remove("hidden");

    toast.classList.toggle(
      "error",
      isError
    );

    clearTimeout(showToast.timeoutId);

    showToast.timeoutId = setTimeout(
      () => {
        toast.classList.add("hidden");
        toast.classList.remove("error");
      },
      2800
    );
  }

  function openModal(modal) {
    if (!modal) {
      return;
    }

    modal.classList.remove("hidden");
    document.body.style.overflow =
      "hidden";
  }

  function closeModal(modal) {
    if (!modal) {
      return;
    }

    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function closeDropdowns() {
    accountMenu?.classList.add("hidden");

    notificationPanel?.classList.add(
      "hidden"
    );

    accountButton?.setAttribute(
      "aria-expanded",
      "false"
    );

    notificationButton?.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  function showPage(pageName) {
    Object.values(pages).forEach(
      (page) => {
        page?.classList.remove(
          "active-page"
        );
      }
    );

    document
      .querySelectorAll(".nav-link")
      .forEach((button) => {
        button.classList.remove("active");
      });

    if (pageName === "home") {
      pages.home?.classList.add(
        "active-page"
      );

      document
        .querySelector(
          '[data-page="home"].nav-link'
        )
        ?.classList.add("active");
    } else if (pageName === "profile") {
      pages.profile?.classList.add(
        "active-page"
      );

      renderProfile();
      loadTeamMembersFromBackend();
    } else if (pageName === "settings") {
      pages.settings?.classList.add(
        "active-page"
      );

      renderSettings("notifications");
    }

    closeDropdowns();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function showPlaceholder(title) {
    Object.values(pages).forEach(
      (page) => {
        page?.classList.remove(
          "active-page"
        );
      }
    );

    pages.placeholder?.classList.add(
      "active-page"
    );

    if (placeholderTitle) {
      placeholderTitle.textContent = title;
    }

    closeDropdowns();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  document.addEventListener(
    "click",
    (event) => {
      const element = event.target;

      if (!(element instanceof Element)) {
        return;
      }

      const pageButton =
        element.closest("[data-page]");

      if (pageButton) {
        if (pageButton.dataset.page) {
          showPage(
            pageButton.dataset.page
          );
        }

        return;
      }

      const placeholderButton =
        element.closest(
          "[data-placeholder]"
        );

      if (placeholderButton) {
        showPlaceholder(
          placeholderButton.dataset
            .placeholder || "Module"
        );

        return;
      }

      const inviteButton =
        element.closest(
          '[data-action="invite-team-member"]'
        );

      if (inviteButton) {
        openInviteTeamModal();
      }
    }
  );

  accountButton?.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();

      const isOpening =
        accountMenu?.classList.contains(
          "hidden"
        );

      notificationPanel?.classList.add(
        "hidden"
      );

      notificationButton?.setAttribute(
        "aria-expanded",
        "false"
      );

      accountMenu?.classList.toggle(
        "hidden",
        !isOpening
      );

      accountButton.setAttribute(
        "aria-expanded",
        String(Boolean(isOpening))
      );
    }
  );

  notificationButton?.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();

      const isOpening =
        notificationPanel?.classList
          .contains("hidden");

      accountMenu?.classList.add(
        "hidden"
      );

      accountButton?.setAttribute(
        "aria-expanded",
        "false"
      );

      notificationPanel?.classList.toggle(
        "hidden",
        !isOpening
      );

      notificationButton.setAttribute(
        "aria-expanded",
        String(Boolean(isOpening))
      );

      renderNotifications();
    }
  );

  markAllReadButton?.addEventListener(
    "click",
    () => {
      notifications =
        notifications.map((item) => ({
          ...item,
          read: true
        }));

      saveData(
        STORAGE_KEYS.notifications,
        notifications
      );

      renderNotifications();

      showToast(
        "All notifications marked as read."
      );
    }
  );

  function renderNotifications() {
    if (!notificationList) {
      return;
    }

    notificationList.innerHTML =
      notifications
        .map(
          (item) => `
            <article class="notification-item ${
              item.read
                ? "read"
                : "unread"
            }">
              <strong>
                ${escapeHtml(item.title)}
              </strong>

              <p>
                ${escapeHtml(item.message)}
              </p>
            </article>
          `
        )
        .join("");

    const unreadCount =
      notifications.filter(
        (item) => !item.read
      ).length;

    notificationBadge?.classList.toggle(
      "hidden",
      unreadCount === 0
    );
  }

  function renderHome() {
    if (!homeStats) {
      return;
    }

    const stats = [
      {
        value: 5,
        label: "Open postings",
        icon: "▣"
      },
      {
        value: 9,
        label: "Applicants",
        icon: "♙"
      },
      {
        value: 2,
        label: "Upcoming events",
        icon: "□"
      }
    ];

    homeStats.innerHTML = stats
      .map(
        (item) => `
          <article class="stat-card">
            <div>
              <strong>${item.value}</strong>

              <span>
                ${escapeHtml(item.label)}
              </span>
            </div>

            <span class="stat-icon">
              ${item.icon}
            </span>
          </article>
        `
      )
      .join("");
  }

  function renderProfile() {
    renderPerformanceStats();
    renderProfileOverview();
    renderHiringFocus();
    renderSocialLinks();
    renderTeamMembers();
    renderWorkplaceDetails();
    renderActivity();
  }

  function renderPerformanceStats() {
    if (!performanceStats) {
      return;
    }

    performanceStats.innerHTML =
      performanceData
        .map(
          (item) => `
            <article class="performance-item">
              <span class="performance-icon">
                ${item.icon}
              </span>

              <div>
                <strong>${item.value}</strong>

                <p>
                  ${escapeHtml(item.label)}
                </p>

                <small>All time</small>
              </div>
            </article>
          `
        )
        .join("");
  }

  function createDetailRow(label, value) {
    return `
      <div class="detail-row">
        <strong>
          ${escapeHtml(label)}
        </strong>

        <span>
          ${escapeHtml(value)}
        </span>
      </div>
    `;
  }

  function renderProfileOverview() {
    if (!profileOverview) {
      return;
    }

    profileOverview.innerHTML = `
      <div class="profile-identity">
        <div class="avatar large">
          ${escapeHtml(
            getInitials(profile.name)
          )}
        </div>

        <div class="profile-copy">
          <h2>
            ${escapeHtml(profile.name)}
          </h2>

          <h3>
            ${escapeHtml(
              profile.companyName
            )}
          </h3>

          <span class="role-tag">
            ${escapeHtml(profile.role)}
          </span>

          <p>
            ✉ ${escapeHtml(profile.email)}
          </p>

          <p>
            ☎ ${escapeHtml(profile.phone)}
          </p>

          <p>
            ◉ ${escapeHtml(profile.website)}
          </p>

          <p>
            ⌖ ${escapeHtml(profile.location)}
          </p>
        </div>
      </div>

      <div class="profile-details">
        ${createDetailRow(
          "Industry",
          profile.industry
        )}

        ${createDetailRow(
          "Company Size",
          profile.companySize
        )}

        ${createDetailRow(
          "Founded",
          profile.founded
        )}

        ${createDetailRow(
          "Timezone",
          profile.timezone
        )}
      </div>

      <div class="about-company">
        <h3>About Company</h3>

        <p>
          ${escapeHtml(profile.about)}
        </p>
      </div>
    `;
  }

  function renderHiringFocus() {
    if (!hiringFocusCard) {
      return;
    }

    const list =
      Array.isArray(profile.hiringFocus)
        ? profile.hiringFocus
        : String(
            profile.hiringFocus || ""
          )
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

    hiringFocusCard.innerHTML = `
      <h3>◎ Hiring Focus</h3>

      <div class="tag-list">
        ${list
          .map(
            (item) => `
              <span>
                ${escapeHtml(item)}
              </span>
            `
          )
          .join("")}
      </div>
    `;
  }

  function createSocialLink(
    label,
    value
  ) {
    return `
      <a
        class="social-row"
        href="${escapeHtml(
          normalizeUrl(value)
        )}"
        target="_blank"
        rel="noopener noreferrer"
      >
        <strong>
          ${escapeHtml(label)}
        </strong>

        <span>
          ${escapeHtml(value)}
        </span>

        <span>↗</span>
      </a>
    `;
  }

  function renderSocialLinks() {
    if (!socialCard) {
      return;
    }

    socialCard.innerHTML = `
      <h3>◉ Social & Company Links</h3>

      <div class="social-list">
        ${createSocialLink(
          "Website",
          profile.website
        )}

        ${createSocialLink(
          "LinkedIn",
          profile.linkedin
        )}

        ${createSocialLink(
          "Twitter / X",
          profile.twitter
        )}

        ${createSocialLink(
          "Facebook",
          profile.facebook
        )}
      </div>
    `;
  }

  function createTeamMemberMarkup(
    member
  ) {
    return `
      <article class="team-member-row">
        <div class="team-member-info">
          <span class="avatar small">
            ${escapeHtml(
              getInitials(member.name)
            )}
          </span>

          <div class="team-member-copy">
            <strong>
              ${escapeHtml(member.name)}
            </strong>

            <small>
              ${escapeHtml(member.role)}
            </small>
          </div>
        </div>

        <span class="member-access">
          ${escapeHtml(member.access)}
        </span>
      </article>
    `;
  }

  function renderTeamMembers() {
    if (!teamCard) {
      return;
    }

    teamCard.innerHTML = `
      <div class="card-heading">
        <h3>♙ Team Members</h3>

        <button
          type="button"
          id="viewAllTeamButton"
          class="text-btn"
        >
          View all
        </button>
      </div>

      <div class="team-members-list">
        ${teamMembers
          .map(createTeamMemberMarkup)
          .join("")}
      </div>

      <button
        type="button"
        class="invite-team-btn"
        data-action="invite-team-member"
      >
        + Invite Team Member
      </button>
    `;

    document
      .getElementById(
        "viewAllTeamButton"
      )
      ?.addEventListener(
        "click",
        () => {
          showToast(
            `${teamMembers.length} team member${
              teamMembers.length === 1
                ? ""
                : "s"
            } displayed.`
          );
        }
      );
  }

  function renderWorkplaceDetails() {
    if (!workplaceCard) {
      return;
    }

    workplaceCard.innerHTML = `
      <h3>
        ▣ Workplace & Hiring Details
      </h3>

      <div class="workplace-list">
        ${createDetailRow(
          "Work Types",
          profile.workTypes
        )}

        ${createDetailRow(
          "Preferred Locations",
          profile.preferredLocations
        )}

        ${createDetailRow(
          "Interview Mode",
          profile.interviewMode
        )}

        ${createDetailRow(
          "Hiring Volume",
          profile.hiringVolume
        )}
      </div>
    `;
  }

  function createActivityMarkup(
    icon,
    title,
    description,
    date
  ) {
    return `
      <article class="activity-item">
        <span class="activity-icon">
          ${icon}
        </span>

        <div>
          <strong>
            ${escapeHtml(title)}
          </strong>

          <p>
            ${escapeHtml(description)}
          </p>

          <small>
            ${escapeHtml(date)}
          </small>
        </div>
      </article>
    `;
  }

  function renderActivity() {
    if (!activityCard) {
      return;
    }

    activityCard.innerHTML = `
      <div class="card-heading">
        <h3>⌁ Recent Activity</h3>

        <button
          type="button"
          id="viewActivityButton"
          class="text-btn"
        >
          View all activity
        </button>
      </div>

      <div class="activity-grid">
        ${createActivityMarkup(
          "♙",
          "Profile updated",
          "You updated company information",
          "July 13, 2026 · 10:24 AM"
        )}

        ${createActivityMarkup(
          "▣",
          "New job posted",
          "Senior Full Stack Developer",
          "July 10, 2026 · 3:45 PM"
        )}

        ${createActivityMarkup(
          "□",
          "Event scheduled",
          "Austin Tech Hiring Day",
          "July 8, 2026 · 11:15 AM"
        )}
      </div>
    `;

    document
      .getElementById(
        "viewActivityButton"
      )
      ?.addEventListener(
        "click",
        () => {
          showToast(
            "All recent employer activity is displayed."
          );
        }
      );
  }

  function getFormValue(
    formData,
    name
  ) {
    return String(
      formData.get(name) || ""
    ).trim();
  }

  function setFormValue(name, value) {
    const field =
      profileForm?.elements.namedItem(name);

    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement
    ) {
      field.value = String(value || "");
    }
  }

  function populateProfileForm() {
    if (!profileForm) {
      return;
    }

    const fields = [
      "name",
      "companyName",
      "role",
      "email",
      "phone",
      "website",
      "location",
      "industry",
      "companySize",
      "founded",
      "timezone",
      "about",
      "workTypes",
      "preferredLocations",
      "interviewMode",
      "hiringVolume",
      "linkedin",
      "twitter",
      "facebook"
    ];

    fields.forEach((field) => {
      setFormValue(
        field,
        profile[field]
      );
    });

    setFormValue(
      "hiringFocus",
      Array.isArray(profile.hiringFocus)
        ? profile.hiringFocus.join(", ")
        : profile.hiringFocus
    );
  }

  editProfileButton?.addEventListener(
    "click",
    () => {
      populateProfileForm();
      openModal(profileModal);
    }
  );

  closeModalButton?.addEventListener(
    "click",
    () => {
      closeModal(profileModal);
    }
  );

  cancelModalButton?.addEventListener(
    "click",
    () => {
      closeModal(profileModal);
    }
  );

  profileModal?.addEventListener(
    "click",
    (event) => {
      if (event.target === profileModal) {
        closeModal(profileModal);
      }
    }
  );

  profileForm?.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const formData =
        new FormData(profileForm);

      profile = {
        ...profile,
        name: getFormValue(
          formData,
          "name"
        ),
        companyName: getFormValue(
          formData,
          "companyName"
        ),
        role: getFormValue(
          formData,
          "role"
        ),
        email: getFormValue(
          formData,
          "email"
        ),
        phone: getFormValue(
          formData,
          "phone"
        ),
        website: getFormValue(
          formData,
          "website"
        ),
        location: getFormValue(
          formData,
          "location"
        ),
        industry: getFormValue(
          formData,
          "industry"
        ),
        companySize: getFormValue(
          formData,
          "companySize"
        ),
        founded: getFormValue(
          formData,
          "founded"
        ),
        timezone: getFormValue(
          formData,
          "timezone"
        ),
        about: getFormValue(
          formData,
          "about"
        ),
        hiringFocus: getFormValue(
          formData,
          "hiringFocus"
        )
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        workTypes: getFormValue(
          formData,
          "workTypes"
        ),
        preferredLocations:
          getFormValue(
            formData,
            "preferredLocations"
          ),
        interviewMode: getFormValue(
          formData,
          "interviewMode"
        ),
        hiringVolume: getFormValue(
          formData,
          "hiringVolume"
        ),
        linkedin: getFormValue(
          formData,
          "linkedin"
        ),
        twitter: getFormValue(
          formData,
          "twitter"
        ),
        facebook: getFormValue(
          formData,
          "facebook"
        )
      };

      saveData(
        STORAGE_KEYS.profile,
        profile
      );

      renderProfile();
      closeModal(profileModal);

      showToast(
        "Employer profile saved successfully."
      );
    }
  );

  async function loadTeamMembersFromBackend() {
    try {
      const response = await fetch(
        "/api/team-members",
        {
          headers: {
            Accept: "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load team members."
        );
      }

      const result =
        await response.json();

      if (
        !Array.isArray(
          result.teamMembers
        )
      ) {
        return;
      }

      teamMembers = result.teamMembers;

      saveData(
        STORAGE_KEYS.teamMembers,
        teamMembers
      );

      renderTeamMembers();
    } catch (error) {
      console.error(
        "Team member sync failed:",
        error
      );
    }
  }

  function showInviteMessage(
    message,
    isError = false
  ) {
    if (!inviteMessage) {
      return;
    }

    inviteMessage.textContent = message;

    inviteMessage.classList.toggle(
      "error",
      isError
    );

    inviteMessage.classList.toggle(
      "success",
      !isError
    );
  }

  function clearInviteMessage() {
    if (!inviteMessage) {
      return;
    }

    inviteMessage.textContent = "";

    inviteMessage.classList.remove(
      "error",
      "success"
    );
  }

  function openInviteTeamModal() {
    inviteTeamForm?.reset();
    clearInviteMessage();
    openModal(inviteTeamModal);

    setTimeout(() => {
      document
        .getElementById(
          "teamMemberName"
        )
        ?.focus();
    }, 100);
  }

  function closeInviteTeam() {
    closeModal(inviteTeamModal);
    inviteTeamForm?.reset();
    clearInviteMessage();
  }

  closeInviteTeamModalButton
    ?.addEventListener(
      "click",
      closeInviteTeam
    );

  cancelInviteTeamButton
    ?.addEventListener(
      "click",
      closeInviteTeam
    );

  inviteTeamModal?.addEventListener(
    "click",
    (event) => {
      if (
        event.target === inviteTeamModal
      ) {
        closeInviteTeam();
      }
    }
  );

  inviteTeamForm?.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      const formData =
        new FormData(inviteTeamForm);

      const memberName =
        getFormValue(
          formData,
          "memberName"
        );

      const memberEmail =
        getFormValue(
          formData,
          "memberEmail"
        );

      const memberRole =
        getFormValue(
          formData,
          "memberRole"
        );

      const memberAccess =
        getFormValue(
          formData,
          "memberAccess"
        ) || "Member";

      if (
        !memberName ||
        !memberEmail ||
        !memberRole
      ) {
        showInviteMessage(
          "Please complete all invitation fields.",
          true
        );

        return;
      }

      try {
        clearInviteMessage();

        if (sendInvitationButton) {
          sendInvitationButton.disabled =
            true;

          sendInvitationButton.textContent =
            "Sending...";
        }

        const response = await fetch(
          "/api/invitations",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Accept:
                "application/json"
            },
            body: JSON.stringify({
              name: memberName,
              email: memberEmail,
              role: memberRole,
              access: memberAccess
            })
          }
        );

        const result =
          await response
            .json()
            .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to send the invitation."
          );
        }

        closeInviteTeam();

        if (confirmationMessage) {
          confirmationMessage.textContent =
            `An invitation was sent to ${memberEmail}. ` +
            `${memberName} will appear as a team member after accepting it.`;
        }

        openModal(confirmationModal);

        showToast(
          "Invitation email sent successfully."
        );
      } catch (error) {
        console.error(
          "Invitation error:",
          error
        );

        showInviteMessage(
          error.message ||
            "Unable to send the invitation.",
          true
        );
      } finally {
        if (sendInvitationButton) {
          sendInvitationButton.disabled =
            false;

          sendInvitationButton.textContent =
            "Send Invitation";
        }
      }
    }
  );

  closeConfirmationModalButton
    ?.addEventListener(
      "click",
      () => {
        closeModal(confirmationModal);
        loadTeamMembersFromBackend();
      }
    );

  confirmationModal?.addEventListener(
    "click",
    (event) => {
      if (
        event.target ===
        confirmationModal
      ) {
        closeModal(confirmationModal);
        loadTeamMembersFromBackend();
      }
    }
  );

  window.addEventListener(
    "focus",
    loadTeamMembersFromBackend
  );

  document
    .querySelectorAll(".settings-tab")
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          document
            .querySelectorAll(
              ".settings-tab"
            )
            .forEach((tab) => {
              tab.classList.remove(
                "active"
              );
            });

          button.classList.add("active");

          renderSettings(
            button.dataset.settingsTab
          );
        }
      );
    });

  function createToggleRow(
    key,
    title,
    description,
    enabled
  ) {
    return `
      <div class="setting-row">
        <div>
          <strong>
            ${escapeHtml(title)}
          </strong>

          <p>
            ${escapeHtml(description)}
          </p>
        </div>

        <button
          type="button"
          class="toggle-button ${
            enabled ? "enabled" : ""
          }"
          data-setting-toggle="${escapeHtml(
            key
          )}"
          aria-pressed="${enabled}"
        >
          <span></span>
        </button>
      </div>
    `;
  }

  function createSelectSetting(
    key,
    label,
    options,
    selected
  ) {
    return `
      <label>
        ${escapeHtml(label)}

        <select
          data-setting-select="${escapeHtml(
            key
          )}"
        >
          ${options
            .map(
              (option) => `
                <option
                  value="${escapeHtml(
                    option
                  )}"
                  ${
                    option === selected
                      ? "selected"
                      : ""
                  }
                >
                  ${escapeHtml(option)}
                </option>
              `
            )
            .join("")}
        </select>
      </label>
    `;
  }

  function createSaveSettingsButton() {
    return `
      <div class="settings-actions">
        <button
          type="button"
          id="resetSettingsButton"
          class="secondary-btn"
        >
          Reset
        </button>

        <button
          type="button"
          id="saveSettingsButton"
          class="primary-btn"
        >
          Save Changes
        </button>
      </div>
    `;
  }

  function renderNotificationSettings() {
    settingsContent.innerHTML = `
      <div class="settings-heading">
        <h2>Notification Preferences</h2>

        <p>
          Choose which employer notifications you receive.
        </p>
      </div>

      ${createToggleRow(
        "emailNotifications",
        "Email notifications",
        "Receive important Waypoint updates through email.",
        settings.emailNotifications
      )}

      ${createToggleRow(
        "applicantNotifications",
        "New applicant notifications",
        "Receive an alert when a candidate applies.",
        settings.applicantNotifications
      )}

      ${createToggleRow(
        "eventReminders",
        "Hiring event reminders",
        "Receive reminders before scheduled hiring events.",
        settings.eventReminders
      )}

      ${createToggleRow(
        "marketingEmails",
        "Product and marketing emails",
        "Receive product announcements and hiring tips.",
        settings.marketingEmails
      )}

      ${createSaveSettingsButton()}
    `;

    connectSettingsButtons();
  }

  function renderAccountSettings() {
    settingsContent.innerHTML = `
      <div class="settings-heading">
        <h2>Account & Security</h2>

        <p>
          Manage employer account security and access.
        </p>
      </div>

      ${createToggleRow(
        "twoFactorAuthentication",
        "Two-factor authentication",
        "Require additional verification when signing in.",
        settings.twoFactorAuthentication
      )}

      ${createToggleRow(
        "loginAlerts",
        "Login and session alerts",
        "Receive alerts when your account is accessed.",
        settings.loginAlerts
      )}

      <div class="setting-row">
        <div>
          <strong>Password</strong>

          <p>
            Update your employer account password.
          </p>
        </div>

        <button
          type="button"
          id="changePasswordButton"
          class="secondary-btn"
        >
          Change Password
        </button>
      </div>

      ${createSaveSettingsButton()}
    `;

    connectSettingsButtons();

    document
      .getElementById(
        "changePasswordButton"
      )
      ?.addEventListener(
        "click",
        () => {
          const password = prompt(
            "Enter a new password with at least 8 characters:"
          );

          if (!password) {
            return;
          }

          if (password.length < 8) {
            showToast(
              "Password must contain at least 8 characters.",
              true
            );

            return;
          }

          showToast(
            "Password updated for this demonstration."
          );
        }
      );
  }

  function renderPreferenceSettings() {
    settingsContent.innerHTML = `
      <div class="settings-heading">
        <h2>Preferences</h2>

        <p>
          Customize appearance and regional information.
        </p>
      </div>

      <div class="form-grid">
        ${createSelectSetting(
          "theme",
          "Theme",
          [
            "Light",
            "Dark",
            "System"
          ],
          settings.theme
        )}

        ${createSelectSetting(
          "language",
          "Language",
          [
            "English",
            "Spanish",
            "French",
            "Hindi"
          ],
          settings.language
        )}

        ${createSelectSetting(
          "timezone",
          "Timezone",
          [
            "Eastern Time (ET)",
            "Central Time (CT)",
            "Mountain Time (MT)",
            "Pacific Time (PT)"
          ],
          settings.timezone
        )}
      </div>

      ${createSaveSettingsButton()}
    `;

    connectSettingsButtons();
  }

  function renderPrivacySettings() {
    settingsContent.innerHTML = `
      <div class="settings-heading">
        <h2>
          Advanced Privacy Features
        </h2>

        <p>
          Control account visibility, data sharing, and access.
        </p>
      </div>

      ${createToggleRow(
        "profileVisibility",
        "Employer profile visibility",
        "Allow verified candidates to view your employer profile.",
        settings.profileVisibility
      )}

      ${createToggleRow(
        "dataSharing",
        "Data sharing controls",
        "Allow anonymous hiring analytics to improve Waypoint.",
        settings.dataSharing
      )}

      <div class="setting-row">
        <div>
          <strong>
            Download account data
          </strong>

          <p>
            Download employer profile, team members, and settings.
          </p>
        </div>

        <button
          type="button"
          id="downloadDataButton"
          class="secondary-btn"
        >
          Download Data
        </button>
      </div>

      <div class="setting-row">
        <div>
          <strong>
            Sign out from all devices
          </strong>

          <p>
            End every active session connected to this account.
          </p>
        </div>

        <button
          type="button"
          id="signOutAllButton"
          class="danger-btn"
        >
          Sign Out All
        </button>
      </div>

      ${createSaveSettingsButton()}
    `;

    connectSettingsButtons();

    document
      .getElementById(
        "downloadDataButton"
      )
      ?.addEventListener(
        "click",
        downloadAccountData
      );

    document
      .getElementById(
        "signOutAllButton"
      )
      ?.addEventListener(
        "click",
        logout
      );
  }

  function renderSettings(
    tabName = "notifications"
  ) {
    if (!settingsContent) {
      return;
    }

    if (tabName === "account") {
      renderAccountSettings();
    } else if (
      tabName === "preferences"
    ) {
      renderPreferenceSettings();
    } else if (tabName === "danger") {
      renderPrivacySettings();
    } else {
      renderNotificationSettings();
    }
  }

  function connectSettingsButtons() {
    settingsContent
      ?.querySelectorAll(
        "[data-setting-toggle]"
      )
      .forEach((button) => {
        button.addEventListener(
          "click",
          () => {
            const key =
              button.dataset.settingToggle;

            if (!key) {
              return;
            }

            settings[key] =
              !settings[key];

            button.classList.toggle(
              "enabled",
              Boolean(settings[key])
            );

            button.setAttribute(
              "aria-pressed",
              String(
                Boolean(settings[key])
              )
            );
          }
        );
      });

    document
      .getElementById(
        "saveSettingsButton"
      )
      ?.addEventListener(
        "click",
        () => {
          settingsContent
            ?.querySelectorAll(
              "[data-setting-select]"
            )
            .forEach((select) => {
              const key =
                select.dataset.settingSelect;

              if (
                key &&
                select instanceof
                  HTMLSelectElement
              ) {
                settings[key] =
                  select.value;
              }
            });

          saveData(
            STORAGE_KEYS.settings,
            settings
          );

          showToast(
            "Settings saved successfully."
          );
        }
      );

    document
      .getElementById(
        "resetSettingsButton"
      )
      ?.addEventListener(
        "click",
        () => {
          settings =
            structuredClone(
              defaultSettings
            );

          saveData(
            STORAGE_KEYS.settings,
            settings
          );

          const activeTab =
            document.querySelector(
              ".settings-tab.active"
            );

          renderSettings(
            activeTab?.dataset
              .settingsTab ||
              "notifications"
          );

          showToast(
            "Default settings restored."
          );
        }
      );
  }

  function downloadAccountData() {
    const data = {
      profile,
      teamMembers,
      settings,
      notifications,
      exportedAt:
        new Date().toISOString()
    };

    const file = new Blob(
      [
        JSON.stringify(
          data,
          null,
          2
        )
      ],
      {
        type: "application/json"
      }
    );

    const url =
      URL.createObjectURL(file);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "waypoint-employer-account-data.json";

    document.body.appendChild(link);

    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    showToast(
      "Account data downloaded successfully."
    );
  }

  logoutButton?.addEventListener(
    "click",
    logout
  );

  function logout() {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmed) {
      return;
    }

    closeDropdowns();
    showPage("home");

    showToast(
      "You have been logged out."
    );
  }

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      const clickedAccount =
        accountButton?.contains(target) ||
        accountMenu?.contains(target);

      const clickedNotifications =
        notificationButton?.contains(
          target
        ) ||
        notificationPanel?.contains(
          target
        );

      if (
        !clickedAccount &&
        !clickedNotifications
      ) {
        closeDropdowns();
      }
    }
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape") {
        return;
      }

      closeDropdowns();
      closeModal(profileModal);
      closeModal(inviteTeamModal);
      closeModal(confirmationModal);
    }
  );

  renderHome();
  renderNotifications();
  renderProfile();
  renderSettings("notifications");
  showPage("home");
  loadTeamMembersFromBackend();

  console.log(
    "Waypoint Employer Portal initialized successfully."
  );
})();