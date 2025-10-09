const BASE_URL = "https://68e76e7d10e3f82fbf3f1b54.mockapi.io/api/result";
const USERS_URL = `${BASE_URL}/users`;
const RESULTS_URL = `${BASE_URL}/results`;

const $ = id => document.getElementById(id);
let currentUser = JSON.parse(localStorage.getItem("user")) || null;
$("showSignupBtn").onclick = () => {
    $("signupView").style.display = "block";
    $("loginView").style.display = "none";
};
$("showLoginBtn").onclick = () => {
    $("loginView").style.display = "block";
    $("signupView").style.display = "none";
};

function showAuthenticated() {
    $("authCard").style.display = "none";
    $("appShell").style.display = "block";
    document.body.classList.add("app-shell-visible");
    $("sidebar").style.display = "flex";
    if (currentUser) {
        $("sidebarUser").textContent = currentUser.name || currentUser.email;
        $("signedInAs").textContent = "Signed in as " + (currentUser.email || "");
    }
    showDashboard();
}
function showUnauthenticated() {
    $("authCard").style.display = "block";
    $("appShell").style.display = "none";
    document.body.classList.remove("app-shell-visible");
    $("sidebar").style.display = "none";
    $("loginView").style.display = "block";
    $("signupView").style.display = "none";
}

/* --- navigation --- */
function showDashboard() {
    $("addSection").classList.add("section-hidden");
    $("listSection").style.display = "block";
    $("pageTitle").textContent = "Dashboard";
    loadResults();
    document.querySelectorAll(".menu-item").forEach(btn => btn.classList.remove("active"));
    const el = document.querySelector('.menu-item[data-section="dashboard"]');
    if (el) el.classList.add("active");
}
function showAddResult() {
    $("addSection").classList.remove("section-hidden");
    $("listSection").style.display = "none";
    $("pageTitle").textContent = "Add Result";
    document.querySelectorAll(".menu-item").forEach(btn => btn.classList.remove("active"));
    const el = document.querySelector('.menu-item[data-section="addResult"]');
    if (el) el.classList.add("active");
}
const menuDashboard = document.querySelector('.menu-item[data-section="dashboard"]');
const menuAdd = document.querySelector('.menu-item[data-section="addResult"]');
if (menuDashboard) menuDashboard.onclick = showDashboard;
if (menuAdd) menuAdd.onclick = showAddResult;

async function safeGet(url) {
    const r = await fetch(url);
    if (!r.ok) {
        const txt = await r.text().catch(() => r.statusText);
        throw new Error(`GET ${url} failed: ${r.status} ${txt}`);
    }
    return r.json();
}
async function safePost(url, body) {
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok) {
        const txt = await r.text().catch(() => r.statusText);
        throw new Error(`POST ${url} failed: ${r.status} ${txt}`);
    }
    return r.json();
}
async function safePut(url, body) {
    const r = await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok) {
        const txt = await r.text().catch(() => r.statusText);
        throw new Error(`PUT ${url} failed: ${r.status} ${txt}`);
    }
    return r.json();
}
async function safeDelete(url) {
    const r = await fetch(url, { method: "DELETE" });
    if (!r.ok) {
        const txt = await r.text().catch(() => r.statusText);
        throw new Error(`DELETE ${url} failed: ${r.status} ${txt}`);
    }
    return r.json();
}

$("signupForm").addEventListener("submit", async e => {
    e.preventDefault();
    const name = $("signupName").value.trim();
    const email = $("signupEmail").value.trim();
    const pw = $("signupPassword").value;
    const pw2 = $("signupPassword2").value;
    $("signupMsg").textContent = "";
    if (pw.length < 6) return $("signupMsg").textContent = "Password at least 6 chars";
    if (pw !== pw2) return $("signupMsg").textContent = "Passwords do not match";
    try {
        const users = await safeGet(`${USERS_URL}?email=${encodeURIComponent(email)}`);
        if (Array.isArray(users) && users.length) {
            $("signupMsg").textContent = "Email already registered!";
            return;
        }
        const created = await safePost(USERS_URL, { name, email, password: pw });
        $("signupMsg").textContent = "Signup successful!";
        setTimeout(() => { $("showLoginBtn").click(); }, 700);
    } catch (err) {
        console.error("Signup error:", err);
        $("signupMsg").textContent = "Signup failed: " + (err.message || "");
    }
});

$("loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    const email = $("loginEmail").value.trim();
    const password = $("loginPassword").value;
    $("loginMsg").textContent = "";
    try {
        const users = await safeGet(`${USERS_URL}?email=${encodeURIComponent(email)}`);
        if (!Array.isArray(users) || users.length === 0) {
            $("loginMsg").textContent = "Invalid login!";
            return;
        }
        const user = users.find(u => String(u.password) === String(password)) || users[0];
        if (!user || String(user.password) !== String(password)) {
            $("loginMsg").textContent = "Invalid login!";
            return;
        }
        currentUser = user;
        localStorage.setItem("user", JSON.stringify(user));
        showAuthenticated();
    } catch (err) {
        console.error("Login fetch error:", err);
        $("loginMsg").textContent = "Login failed: " + (err.message || "");
    }
});

$("logoutBtn").onclick = () => {
    localStorage.removeItem("user");
    currentUser = null;
    showUnauthenticated();
};

$("addForm").addEventListener("submit", async e => {
    e.preventDefault();
    if (!currentUser) return alert("Please login");
    const payload = {
        student: $("student").value,
        subject: $("subject").value,
        marks: $("marks").value,
        date: $("date").value || new Date().toISOString().split("T")[0],
        userId: currentUser.id
    };
    $("addMsg").textContent = "";
    try {
        await safePost(RESULTS_URL, payload);
        $("addMsg").textContent = "Result added!";
        $("addForm").reset();
        setTimeout(() => showDashboard(), 900);
    } catch (err) {
        console.error("Add result error:", err);
        $("addMsg").textContent = "Add failed: " + (err.message || "");
    }
});
$("clearAdd").onclick = () => $("addForm").reset();
let currentEditId = null;
window.showEditResult = async function (id) {
    try {
        const item = await safeGet(`${RESULTS_URL}/${id}`);
        $("editStudent").value = item.student || "";
        $("editSubject").value = item.subject || "";
        $("editMarks").value = item.marks || "";
        $("editDate").value = item.date || "";
        $("editMsg").textContent = "";
        currentEditId = id;
        $("editModal").classList.add("active");
    } catch (err) {
        console.error("Failed to fetch item for edit:", err);
        alert("Cannot open editor: " + (err.message || ""));
    }
};
$("closeEditModal").onclick = () => { $("editModal").classList.remove("active"); currentEditId = null; };
$("editForm").onsubmit = async (e) => {
    e.preventDefault();
    if (!currentEditId) return;
    try {
        await safePut(`${RESULTS_URL}/${currentEditId}`, {
            student: $("editStudent").value,
            subject: $("editSubject").value,
            marks: $("editMarks").value,
            date: $("editDate").value,
            userId: currentUser.id
        });
        $("editMsg").textContent = "Updated!";
        setTimeout(() => { $("editModal").classList.remove("active"); loadResults(); currentEditId = null; }, 700);
    } catch (err) {
        console.error("Update failed:", err);
        $("editMsg").textContent = "Update failed: " + (err.message || "");
    }
};

async function loadResults() {
    if (!currentUser) {
        $("resultsList").innerHTML = "<div>Please login to see results.</div>";
        return;
    }
    $("resultsList").innerHTML = "<div>Loading...</div>";
    try {
        const data = await safeGet(`${RESULTS_URL}?userId=${encodeURIComponent(currentUser.id)}`);
        $("resultsList").innerHTML = "";
        if (!Array.isArray(data) || data.length === 0) {
            $("noResults").textContent = "No results found.";
            return;
        }
        $("noResults").textContent = "";
        data.forEach(item => {
            const div = document.createElement("div");
            div.className = "result-card";
            div.innerHTML = `
        <span>
          <strong>${escapeHtml(item.student)}</strong> — ${escapeHtml(item.subject)} —
          <span class="pill">${escapeHtml(item.marks)}</span>
          <span style="color:#aaa;font-size:0.9em;">(${escapeHtml(item.date || '')})</span>
        </span>
        <span>
          <button class="btn" onclick="showEditResult('${item.id}')">✏️ Edit</button>
          <button class="btn delete" onclick="deleteResult('${item.id}')">❌</button>
        </span>
      `;
            $("resultsList").appendChild(div);
        });
    } catch (err) {
        console.error("Failed fetching results:", err);
        $("resultsList").innerHTML = "<div>Error loading results</div>";
    }
}

window.deleteResult = async function (id) {
    if (!confirm("Delete this result?")) return;
    try {
        await safeDelete(`${RESULTS_URL}/${id}`);
        await loadResults();
    } catch (err) {
        console.error("Delete failed:", err);
        alert("Delete failed: " + (err.message || ""));
    }
};

function escapeHtml(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

if (currentUser) {
    if (!currentUser.id) { localStorage.removeItem("user"); currentUser = null; showUnauthenticated(); }
    else showAuthenticated();
} else {
    showUnauthenticated();
}