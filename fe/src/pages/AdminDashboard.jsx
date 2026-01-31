import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '/logo.png';
import UserAvatar from '../components/layout/UserAvatar';
import ThemeToggler from '../components/ui/ThemeToggler';
import { useAuth } from '../contexts/AuthContext';

const TABS = [
  { key: 'overview', label: 'Overview', icon: 'dashboard' },
  { key: 'users', label: 'Users', icon: 'group' },
  { key: 'roles', label: 'Roles', icon: 'badge' },
  { key: 'permissions', label: 'Permissions', icon: 'verified_user' },
  { key: 'courses', label: 'Courses', icon: 'menu_book' },
  { key: 'instructors', label: 'Instructors', icon: 'school' },
  { key: 'payments', label: 'Payments', icon: 'payments' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
];

const StatCard = ({ title, value, hint, icon }) => {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-sans uppercase tracking-widest text-neutral-500">{title}</div>
          <div className="mt-2 text-3xl font-serif text-neutral-900 dark:text-white">{value}</div>
          {hint ? <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 font-light">{hint}</div> : null}
        </div>
        <div className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
    </div>
  );
};

const AdminModal = ({ title, open, onClose, children, footer }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-lg shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-serif text-neutral-900 dark:text-white">{title}</div>
              <div className="text-[10px] font-sans uppercase tracking-widest text-neutral-500 mt-1">Admin Action</div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center justify-center"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <div className="px-6 py-5">{children}</div>

          <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-2">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
};

const Pill = ({ children, tone = 'neutral' }) => {
  const toneCls =
    tone === 'green'
      ? 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20'
      : tone === 'red'
        ? 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20'
        : tone === 'yellow'
          ? 'bg-yellow-500/10 text-yellow-800 dark:text-yellow-200 border-yellow-500/20'
          : 'bg-neutral-500/10 text-neutral-700 dark:text-neutral-300 border-neutral-500/20';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-sans uppercase tracking-widest border rounded-full ${toneCls}`}>
      {children}
    </span>
  );
};

const UserAdminTab = () => {
  const [query, setQuery] = useState('');

  const [users, setUsers] = useState([
    { id: '1', email: 'admin@trickcode.local', roles: ['ADMIN'], status: 'ACTIVE' },
    { id: '2', email: 'tagiangnamttg@gmail.com', roles: ['STUDENT'], status: 'ACTIVE' },
    { id: '3', email: 'instructor@trickcode.local', roles: ['INSTRUCTOR'], status: 'INACTIVE' },
  ]);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [draft, setDraft] = useState({ id: '', email: '', rolesText: 'STUDENT', status: 'ACTIVE' });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => (u.email || '').toLowerCase().includes(q) || (u.id || '').includes(q));
  }, [query, users]);

  const openCreate = () => {
    setDraft({ id: '', email: '', rolesText: 'STUDENT', status: 'ACTIVE' });
    setCreateOpen(true);
  };

  const openEdit = (u) => {
    setDraft({ id: u.id, email: u.email, rolesText: u.roles.join(','), status: u.status });
    setEditOpen(true);
  };

  const openDelete = (u) => {
    setDraft({ id: u.id, email: u.email, rolesText: u.roles.join(','), status: u.status });
    setDeleteOpen(true);
  };

  const parseRoles = (text) =>
    (text || '')
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean)
      .map((r) => r.toUpperCase());

  const createUser = () => {
    const email = draft.email.trim();
    if (!email) return;

    const nextId = String(Math.max(0, ...users.map((u) => Number(u.id))) + 1);
    const newUser = {
      id: nextId,
      email,
      roles: parseRoles(draft.rolesText),
      status: draft.status,
    };
    setUsers((prev) => [newUser, ...prev]);
    setCreateOpen(false);
  };

  const saveUser = () => {
    const email = draft.email.trim();
    if (!email) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === draft.id
          ? { ...u, email, roles: parseRoles(draft.rolesText), status: draft.status }
          : u
      )
    );
    setEditOpen(false);
  };

  const deleteUser = () => {
    setUsers((prev) => prev.filter((u) => u.id !== draft.id));
    setDeleteOpen(false);
  };

  const toggleStatus = (u) => {
    setUsers((prev) =>
      prev.map((x) => (x.id === u.id ? { ...x, status: x.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : x))
    );
  };

  const statusTone = (s) => (s === 'ACTIVE' ? 'green' : s === 'SUSPENDED' ? 'red' : 'yellow');

  return (
    <div className="space-y-6">
      <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-lg font-serif text-neutral-900 dark:text-white">Users</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">In-memory CRUD (demo). Refresh will reset.</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-base">search</span>
                <input
                  className="pl-10 pr-3 py-2 w-64 max-w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
                  placeholder="Search by email or id"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button
                onClick={openCreate}
                className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 text-xs font-sans uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Create
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800">
              <tr>
                <th className="text-left px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500">ID</th>
                <th className="text-left px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500">Email</th>
                <th className="text-left px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500">Roles</th>
                <th className="text-left px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500">Status</th>
                <th className="text-right px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-sm text-neutral-500 dark:text-neutral-400">
                    No users.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="border-b border-neutral-100 dark:border-neutral-800 last:border-b-0">
                    <td className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-200 font-mono">{u.id}</td>
                    <td className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-200">{u.email}</td>
                    <td className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-200">
                      <div className="flex flex-wrap gap-2">
                        {u.roles.map((r) => (
                          <Pill key={r}>{r}</Pill>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-200">
                      <Pill tone={statusTone(u.status)}>{u.status}</Pill>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleStatus(u)}
                          className="px-3 py-2 text-[10px] font-sans uppercase tracking-widest border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
                        >
                          {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => openEdit(u)}
                          className="px-3 py-2 text-[10px] font-sans uppercase tracking-widest border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDelete(u)}
                          className="px-3 py-2 text-[10px] font-sans uppercase tracking-widest border border-red-500/30 text-red-600 dark:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal
        title="Create User"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        footer={
          <>
            <button
              onClick={() => setCreateOpen(false)}
              className="px-4 py-2 text-xs font-sans uppercase tracking-widest border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={createUser}
              className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 text-xs font-sans uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Create
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-500">Email</label>
            <input
              className="mt-2 w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-sm"
              value={draft.email}
              onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-500">Roles (comma separated)</label>
            <input
              className="mt-2 w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-sm"
              value={draft.rolesText}
              onChange={(e) => setDraft((d) => ({ ...d, rolesText: e.target.value }))}
              placeholder="STUDENT,INSTRUCTOR"
            />
          </div>
          <div>
            <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-500">Status</label>
            <select
              className="mt-2 w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-sm"
              value={draft.status}
              onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
          </div>
        </div>
      </AdminModal>

      <AdminModal
        title={`Edit User #${draft.id}`}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        footer={
          <>
            <button
              onClick={() => setEditOpen(false)}
              className="px-4 py-2 text-xs font-sans uppercase tracking-widest border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveUser}
              className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 text-xs font-sans uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Save
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-500">Email</label>
            <input
              className="mt-2 w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-sm"
              value={draft.email}
              onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-500">Roles (comma separated)</label>
            <input
              className="mt-2 w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-sm"
              value={draft.rolesText}
              onChange={(e) => setDraft((d) => ({ ...d, rolesText: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-500">Status</label>
            <select
              className="mt-2 w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-sm"
              value={draft.status}
              onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
          </div>
        </div>
      </AdminModal>

      <AdminModal
        title="Delete User"
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        footer={
          <>
            <button
              onClick={() => setDeleteOpen(false)}
              className="px-4 py-2 text-xs font-sans uppercase tracking-widest border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={deleteUser}
              className="px-4 py-2 text-xs font-sans uppercase tracking-widest border border-red-500/30 text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </>
        }
      >
        <div className="text-sm text-neutral-700 dark:text-neutral-200">
          You are about to delete:
          <div className="mt-3 p-3 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 rounded">
            <div className="font-mono text-xs text-neutral-500">ID</div>
            <div className="font-mono text-sm">{draft.id}</div>
            <div className="mt-3 font-mono text-xs text-neutral-500">Email</div>
            <div className="text-sm">{draft.email}</div>
          </div>
          <div className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">This is demo CRUD (in-memory). No BE call yet.</div>
        </div>
      </AdminModal>
    </div>
  );
};

const TableShell = ({ title, subtitle, columns, rows, emptyText }) => {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-serif text-neutral-900 dark:text-white">{title}</div>
            {subtitle ? <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{subtitle}</div> : null}
          </div>
          <button className="px-3 py-2 text-[10px] font-sans uppercase tracking-widest border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors rounded">
            Export
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800">
            <tr>
              {columns.map((c) => (
                <th
                  key={c}
                  className="text-left px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-sm text-neutral-500 dark:text-neutral-400">
                  {emptyText || 'No data.'}
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={idx} className="border-b border-neutral-100 dark:border-neutral-800 last:border-b-0">
                  {r.map((cell, i) => (
                    <td key={i} className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-200">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = useMemo(() => user?.roles?.includes('ADMIN'), [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const [activeTab, setActiveTab] = useState('overview');

  const overviewStats = [
    { title: 'Active Users', value: '1,284', hint: '+12% vs last week', icon: 'group' },
    { title: 'Courses', value: '42', hint: '8 drafts', icon: 'menu_book' },
    { title: 'Instructors', value: '13', hint: '2 pending approval', icon: 'school' },
    { title: 'Revenue', value: '$3,240', hint: 'This month', icon: 'payments' },
  ];

  const tabContent = {
    overview: (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {overviewStats.map((s) => (
            <StatCard key={s.title} title={s.title} value={s.value} hint={s.hint} icon={s.icon} />
          ))}
        </div>

        <TableShell
          title="Recent Signups"
          subtitle="Demo data (wired later to IAM)"
          columns={["Email", "Role", "Status", "Created"]}
          rows={[
            ['tagiangnamttg@gmail.com', 'STUDENT', 'ACTIVE', 'Today'],
            ['admin@trickcode.local', 'ADMIN', 'ACTIVE', 'Yesterday'],
            ['instructor@trickcode.local', 'INSTRUCTOR', 'PENDING', '2 days ago'],
          ]}
        />
      </div>
    ),
    users: <UserAdminTab />,
    roles: (
      <TableShell
        title="Roles"
        subtitle="Manage roles and default permissions (demo)"
        columns={["Role", "Description", "#Permissions"]}
        rows={[
          ['ADMIN', 'Full access', 'All'],
          ['INSTRUCTOR', 'Manage courses', '12'],
          ['STUDENT', 'Learn and practice', '6'],
        ]}
      />
    ),
    permissions: (
      <TableShell
        title="Permissions"
        subtitle="Fine-grained access control (demo)"
        columns={["Permission", "Scope", "Description"]}
        rows={[
          ['course:write', 'course', 'Create/update courses'],
          ['user:suspend', 'user', 'Suspend accounts'],
          ['role:assign', 'iam', 'Assign roles'],
        ]}
      />
    ),
    courses: (
      <TableShell
        title="Courses"
        subtitle="Approve, publish, or archive (demo)"
        columns={["Course", "Status", "Lessons", "Owner"]}
        rows={[
          ['Dynamic Programming Patterns', 'PUBLISHED', '12', 'instructor@trickcode.local'],
          ['Intro to Graphs', 'DRAFT', '6', 'instructor@trickcode.local'],
        ]}
      />
    ),
    instructors: (
      <TableShell
        title="Instructors"
        subtitle="KYC / approval workflow (demo)"
        columns={["Email", "Courses", "Status"]}
        rows={[
          ['instructor@trickcode.local', '2', 'APPROVED'],
          ['pending@trickcode.local', '0', 'PENDING'],
        ]}
      />
    ),
    payments: (
      <TableShell
        title="Payments"
        subtitle="Subscriptions and receipts (demo)"
        columns={["Order", "User", "Amount", "Status"]}
        rows={[
          ['INV-1001', 'tagiangnamttg@gmail.com', '$49', 'PAID'],
          ['INV-1002', 'student@trickcode.local', '$49', 'FAILED'],
        ]}
      />
    ),
    settings: (
      <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm">
        <div className="text-lg font-serif text-neutral-900 dark:text-white">Settings / Config</div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Demo form (wired later to config service)</div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-500">Gateway Base URL</label>
            <input
              className="mt-2 w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-sm"
              defaultValue="http://localhost:8080"
            />
          </div>
          <div>
            <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-500">JWKS URL</label>
            <input
              className="mt-2 w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-sm"
              defaultValue="http://localhost:9000/.well-known/jwks.json"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-3 text-xs font-sans uppercase tracking-widest hover:opacity-90 transition-opacity">
            Save
          </button>
        </div>
      </div>
    ),
  };

  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased overflow-x-hidden selection:bg-primary selection:text-white flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <img alt="TrickCode Logo" className="w-full h-full object-contain rounded" src={logo} />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight">Trickcode</span>
          </Link>
          <div className="flex items-center gap-4">
            <UserAvatar />
            <ThemeToggler />
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-28 pb-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 border-b border-neutral-200 dark:border-neutral-800 pb-8">
            <div className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-widest text-neutral-500 mb-4">
              <Link to="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Home</Link>
              <span className="text-neutral-300 dark:text-neutral-700">/</span>
              <span className="text-primary">Admin</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-neutral-900 dark:text-white">Admin Dashboard</h1>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 font-light max-w-3xl">
              System overview and management console. CRUD is in-memory for now (refresh resets).
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar Tabs */}
            <aside className="lg:col-span-3">
              <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg overflow-hidden sticky top-28">
                <div className="px-4 py-4 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="text-[10px] font-sans uppercase tracking-widest text-neutral-500">Navigation</div>
                </div>
                <div className="py-1">
                  {TABS.map((t) => {
                    const active = t.key === activeTab;
                    return (
                      <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-xs font-sans uppercase tracking-widest border-b border-neutral-100 dark:border-neutral-800 last:border-b-0 transition-all hover:pl-5 ${
                          active
                            ? 'text-primary bg-neutral-50 dark:bg-neutral-950'
                            : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base opacity-80">{t.icon}</span>
                          {t.label}
                        </span>
                        <span className={`material-symbols-outlined text-base transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}>
                          arrow_forward
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Content */}
            <section className="lg:col-span-9 space-y-8">
              {tabContent[activeTab]}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
