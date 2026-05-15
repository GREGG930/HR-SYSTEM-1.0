





let cachedElements = {};


function getElement(id) {
  if (!cachedElements[id]) {
    cachedElements[id] = document.getElementById(id);
  }
  return cachedElements[id];
}


function scheduleRender(fn) {
  requestAnimationFrame(fn);
}


const API_BASE = 'http://localhost:3000/api';


let employees = [];
let activities = [];


async function fetchEmployees() {
  try {
    const response = await fetch(`${API_BASE}/employees`);
    if (!response.ok) throw new Error('Failed to fetch employees');
    employees = await response.json();
    return employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}

async function fetchActivities() {
  try {
    const response = await fetch(`${API_BASE}/activities`);
    if (!response.ok) throw new Error('Failed to fetch activities');
    activities = await response.json();
    return activities;
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
}

async function addEmployee(employeeData) {
  try {
    const response = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData)
    });

    if (!response.ok) {
      const errorResponse = await response.json().catch(() => ({}));
      throw new Error(errorResponse.error || 'Failed to add employee');
    }

    const result = await response.json();
    return result.employee || result;
  } catch (error) {
    console.error('Error adding employee:', error);
    throw error;
  }
}

async function addActivity(activityData) {
  try {
    const response = await fetch(`${API_BASE}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData)
    });

    if (!response.ok) throw new Error('Failed to add activity');

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error adding activity:', error);
    throw error;
  }
}


function getEmployeeColors(index) {
  const colorSchemes = [
    { colors: 'from-indigo-400 to-purple-500', roleColor: 'text-indigo-300' },
    { colors: 'from-pink-400 to-rose-500', roleColor: 'text-pink-300' },
    { colors: 'from-emerald-400 to-teal-500', roleColor: 'text-emerald-300' },
    { colors: 'from-violet-400 to-purple-500', roleColor: 'text-violet-300' },
    { colors: 'from-cyan-400 to-blue-500', roleColor: 'text-cyan-300' },
    { colors: 'from-amber-400 to-orange-500', roleColor: 'text-amber-300' },
    { colors: 'from-red-400 to-pink-500', roleColor: 'text-red-300' },
    { colors: 'from-blue-400 to-indigo-500', roleColor: 'text-blue-300' }
  ];
  return colorSchemes[index % colorSchemes.length];
}

const candidates = [
  { initials: 'CM', name: 'Chanda Mwale', applied: '2 days ago', stage: 'Applied', colors: 'from-amber-400 to-orange-500' },
  { initials: 'SM', name: 'Sylvia Mutale', applied: '3 days ago', stage: 'Phone Screen', colors: 'from-indigo-400 to-blue-500' },
  { initials: 'JK', name: 'Joseph Kapembwa', applied: '5 days ago', stage: 'Interview', colors: 'from-emerald-400 to-green-500' },
  { initials: 'RM', name: 'Ruth Mwansa', applied: '1 week ago', stage: 'Offer', colors: 'from-purple-400 to-violet-500' },
  { initials: 'DL', name: 'David Lungu', applied: '2 weeks ago', stage: 'Hired', colors: 'from-teal-400 to-cyan-500' }
];

const attendanceRecords = [
  { initials: 'MN', name: 'Mwamba Nkandu', role: 'Senior Developer', location: 'Lusaka HQ', clockIn: '07:54 AM', status: 'On Time', colors: 'from-indigo-400 to-purple-500' },
  { initials: 'TM', name: 'Thandiwe Mumba', role: 'Product Manager', location: 'Kitwe Branch', clockIn: '08:03 AM', status: 'On Time', colors: 'from-pink-400 to-rose-500' },
  { initials: 'KB', name: 'Kondwani Banda', role: 'UX Designer', location: 'Ndola Branch', clockIn: '08:42 AM', status: 'Late', colors: 'from-emerald-400 to-teal-500' },
  { initials: 'NZ', name: 'Natasha Zulu', role: 'Marketing Manager', location: 'Livingstone', clockIn: '07:59 AM', status: 'On Time', colors: 'from-violet-400 to-purple-500' },
  { initials: 'BC', name: 'Bwalya Chilufya', role: 'HR Specialist', location: 'Lusaka HQ', clockIn: '-', status: 'Absent', colors: 'from-cyan-400 to-blue-500' }
];

const weeklyAttendance = [
  { day: 'Monday', rate: 95 },
  { day: 'Tuesday', rate: 93 },
  { day: 'Wednesday', rate: 96 },
  { day: 'Thursday', rate: 91 },
  { day: 'Friday', rate: 88 }
];

const timeOffRequests = [
  { initials: 'MN', name: 'Mwamba Nkandu', role: 'Senior Developer', type: 'Sick Leave', dates: 'May 13 - May 14', days: 2, balance: '18 days', status: 'Pending', colors: 'from-indigo-400 to-purple-500' },
  { initials: 'TM', name: 'Thandiwe Mumba', role: 'Product Manager', type: 'Annual Leave', dates: 'May 20 - May 24', days: 5, balance: '21 days', status: 'Approved', colors: 'from-pink-400 to-rose-500' },
  { initials: 'KB', name: 'Kondwani Banda', role: 'UX Designer', type: 'Family Responsibility', dates: 'May 16', days: 1, balance: '16 days', status: 'Pending', colors: 'from-emerald-400 to-teal-500' },
  { initials: 'NZ', name: 'Natasha Zulu', role: 'Marketing Manager', type: 'Annual Leave', dates: 'Jun 3 - Jun 7', days: 5, balance: '24 days', status: 'Approved', colors: 'from-violet-400 to-purple-500' },
  { initials: 'BC', name: 'Bwalya Chilufya', role: 'HR Specialist', type: 'Study Leave', dates: 'May 27 - May 29', days: 3, balance: '5 days', status: 'Pending', colors: 'from-cyan-400 to-blue-500' }
];

const leaveUsage = [
  { type: 'Annual Leave', percent: 64, color: 'from-indigo-500 to-indigo-400' },
  { type: 'Sick Leave', percent: 22, color: 'from-pink-500 to-rose-400' },
  { type: 'Family Responsibility', percent: 9, color: 'from-emerald-500 to-green-400' },
  { type: 'Study Leave', percent: 5, color: 'from-purple-500 to-violet-400' }
];

const payrollRecords = [
  { initials: 'MN', name: 'Mwamba Nkandu', role: 'Senior Developer', dept: 'Engineering', gross: 'K48,500', deductions: 'K8,245', net: 'K40,255', status: 'Ready', colors: 'from-indigo-400 to-purple-500' },
  { initials: 'TM', name: 'Thandiwe Mumba', role: 'Product Manager', dept: 'Product', gross: 'K42,800', deductions: 'K7,276', net: 'K35,524', status: 'Ready', colors: 'from-pink-400 to-rose-500' },
  { initials: 'KB', name: 'Kondwani Banda', role: 'UX Designer', dept: 'Design', gross: 'K31,200', deductions: 'K5,304', net: 'K25,896', status: 'Review', colors: 'from-emerald-400 to-teal-500' },
  { initials: 'NZ', name: 'Natasha Zulu', role: 'Marketing Manager', dept: 'Marketing', gross: 'K38,900', deductions: 'K6,613', net: 'K32,287', status: 'Ready', colors: 'from-violet-400 to-purple-500' },
  { initials: 'BC', name: 'Bwalya Chilufya', role: 'HR Specialist', dept: 'HR', gross: 'K24,600', deductions: 'K4,182', net: 'K20,418', status: 'Paid', colors: 'from-cyan-400 to-blue-500' }
];

const payrollDepartments = [
  { dept: 'Engineering', percent: 45, amount: 'K890,000', color: 'from-indigo-500 to-indigo-400' },
  { dept: 'Operations', percent: 21, amount: 'K410,000', color: 'from-amber-500 to-orange-400' },
  { dept: 'Finance', percent: 16, amount: 'K320,000', color: 'from-emerald-500 to-green-400' },
  { dept: 'Marketing', percent: 14, amount: 'K275,000', color: 'from-pink-500 to-rose-400' },
  { dept: 'Human Resources', percent: 4, amount: 'K185,000', color: 'from-cyan-500 to-blue-400' }
];

const statutorySummary = [
  { label: 'PAYE', amount: 'K242,000', icon: 'landmark' },
  { label: 'NAPSA', amount: 'K96,000', icon: 'shield-check' },
  { label: 'NHIMA', amount: 'K48,000', icon: 'heart-pulse' },
  { label: 'Other Deductions', amount: 'K26,000', icon: 'receipt-text' }
];

function renderEmployeeCards() {
  const grid = getElement('employee-grid');
  if (!grid) return;

  
  grid.innerHTML = '<div class="skeleton h-32 rounded-xl mb-4"></div>'.repeat(6);

  scheduleRender(() => {
    grid.innerHTML = employees.map((e, index) => {
      const colors = getEmployeeColors(index);
      return `
        <div class="glass-card overflow-hidden employee-card">
          <div class="p-6">
            <div class="flex items-center">
              <div class="h-16 w-16 rounded-full bg-gradient-to-br ${colors.colors} flex items-center justify-center text-white text-xl font-bold">${e.initials}</div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-white">${e.name}</h3>
                <p class="text-sm ${colors.roleColor}">${e.role}</p>
                <p class="text-xs text-slate-500">${e.department}</p>
              </div>
            </div>
            <div class="mt-4 space-y-2 text-sm text-slate-400">
              <div class="flex items-center"><i data-lucide="mail" class="mr-2 h-4 w-4"></i>${e.email}</div>
              <div class="flex items-center"><i data-lucide="phone" class="mr-2 h-4 w-4"></i>${e.phone || 'Not provided'}</div>
              <div class="flex items-center"><i data-lucide="map-pin" class="mr-2 h-4 w-4"></i>${e.city || 'Lusaka'}, Zambia</div>
            </div>
            <div class="mt-4 flex justify-between items-center">
              <span class="px-2.5 py-1 text-xs font-semibold rounded-full ${e.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}">${e.status}</span>
              <button class="text-indigo-400 hover:text-indigo-300 text-sm font-medium">View Profile</button>
            </div>
          </div>
          <div class="bg-white/5 px-6 py-4 text-sm">
            <div class="flex justify-between"><span class="text-slate-500">Joined</span><span class="text-slate-300">${e.joined_date}</span></div>
            <div class="flex justify-between mt-2"><span class="text-slate-500">Leave Balance</span><span class="text-slate-300">${e.leave_balance}</span></div>
          </div>
        </div>`;
    }).join('');

    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  });
}

function renderActivityTable() {
  const tbody = getElement('activity-tbody');
  if (!tbody) return;

  tbody.innerHTML = activities.slice(0, 5).map(a => {
    const colors = getEmployeeColors(a.employee_id - 1);
    return `
      <tr>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-full bg-gradient-to-br ${colors.colors} flex items-center justify-center text-white text-xs font-bold">${a.initials}</div>
            <div class="ml-4">
              <div class="text-sm font-medium text-white">${a.employee_name}</div>
              <div class="text-sm text-slate-400">${a.action}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 text-sm text-slate-400">${a.date}</td>
        <td class="px-6 py-4"><span class="px-2.5 py-1 text-xs font-semibold rounded-full ${a.status === 'Pending' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}">${a.status}</span></td>
        <td class="px-6 py-4 text-right text-sm font-medium">
          ${a.status === 'Pending' ? '<button class="text-indigo-400 hover:text-indigo-300 mr-3">Approve</button><button class="text-rose-400 hover:text-rose-300">Decline</button>' : '<button class="text-indigo-400 hover:text-indigo-300">View Details</button>'}
        </td>
      </tr>`;
  }).join('');
}

function renderRecruitment() {
  const container = document.getElementById('recruitment-pipeline');
  if (!container) return;
  const stages = ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Hired'];
  const counts = [32, 12, 8, 3, 2];
  container.innerHTML = stages.map((stage, i) => {
    const c = candidates.find(x => x.stage === stage);
    return `<div class="glass-card p-4">
      <h4 class="font-medium text-white mb-4">${stage} <span class="bg-white/10 rounded-full px-2 py-0.5 text-xs text-slate-400 ml-2">${counts[i]}</span></h4>
      <div class="bg-white/5 rounded-xl p-4 border border-white/5">
        <div class="flex items-start">
          <div class="h-10 w-10 rounded-full bg-gradient-to-br ${c.colors} flex items-center justify-center text-white text-xs font-bold mr-3">${c.initials}</div>
          <div>
            <h5 class="font-medium text-white">${c.name}</h5>
            <p class="text-sm text-slate-400">Applied: ${c.applied}</p>
            <span class="mt-2 inline-block text-xs px-2 py-1 rounded-lg ${stage === 'Hired' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'}">${stage}</span>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

function renderAttendance() {
  const tbody = document.getElementById('attendance-tbody');
  if (tbody) {
    tbody.innerHTML = attendanceRecords.map(a => {
      const statusClass = a.status === 'On Time'
        ? 'bg-emerald-500/20 text-emerald-300'
        : a.status === 'Late'
          ? 'bg-amber-500/20 text-amber-300'
          : 'bg-rose-500/20 text-rose-300';

      return `
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-full bg-gradient-to-br ${a.colors} flex items-center justify-center text-white text-xs font-bold">${a.initials}</div>
              <div class="ml-4">
                <div class="text-sm font-medium text-white">${a.name}</div>
                <div class="text-sm text-slate-400">${a.role}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 text-sm text-slate-400">${a.location}</td>
          <td class="px-6 py-4 text-sm text-slate-400">${a.clockIn}</td>
          <td class="px-6 py-4"><span class="px-2.5 py-1 text-xs font-semibold rounded-full ${statusClass}">${a.status}</span></td>
          <td class="px-6 py-4 text-right text-sm font-medium"><button class="text-indigo-400 hover:text-indigo-300">View Log</button></td>
        </tr>`;
    }).join('');
  }

  const weekly = document.getElementById('attendance-weekly');
  if (weekly) {
    weekly.innerHTML = weeklyAttendance.map(d => `
      <div>
        <div class="flex justify-between text-sm mb-1"><span class="text-slate-300">${d.day}</span><span class="text-slate-400">${d.rate}%</span></div>
        <div class="w-full bg-white/10 rounded-full h-2.5"><div class="bg-gradient-to-r from-indigo-500 to-purple-400 h-2.5 rounded-full" style="width:${d.rate}%"></div></div>
      </div>`).join('');
  }
}

function renderTimeOff() {
  const tbody = document.getElementById('timeoff-tbody');
  if (tbody) {
    tbody.innerHTML = timeOffRequests.map(r => {
      const statusClass = r.status === 'Pending'
        ? 'bg-amber-500/20 text-amber-300'
        : r.status === 'Approved'
          ? 'bg-emerald-500/20 text-emerald-300'
          : 'bg-rose-500/20 text-rose-300';
      const action = r.status === 'Pending'
        ? '<button class="text-indigo-400 hover:text-indigo-300 mr-3">Approve</button><button class="text-rose-400 hover:text-rose-300">Decline</button>'
        : '<button class="text-indigo-400 hover:text-indigo-300">View</button>';

      return `
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-full bg-gradient-to-br ${r.colors} flex items-center justify-center text-white text-xs font-bold">${r.initials}</div>
              <div class="ml-4">
                <div class="text-sm font-medium text-white">${r.name}</div>
                <div class="text-sm text-slate-400">${r.role}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 text-sm text-slate-400">${r.type}</td>
          <td class="px-6 py-4 text-sm text-slate-400">${r.dates}</td>
          <td class="px-6 py-4 text-sm text-slate-400">${r.days}</td>
          <td class="px-6 py-4 text-sm text-slate-400">${r.balance}</td>
          <td class="px-6 py-4"><span class="px-2.5 py-1 text-xs font-semibold rounded-full ${statusClass}">${r.status}</span></td>
          <td class="px-6 py-4 text-right text-sm font-medium">${action}</td>
        </tr>`;
    }).join('');
  }

  const usage = document.getElementById('leave-usage');
  if (usage) {
    usage.innerHTML = leaveUsage.map(item => `
      <div>
        <div class="flex justify-between text-sm mb-1"><span class="text-slate-300">${item.type}</span><span class="text-slate-400">${item.percent}%</span></div>
        <div class="w-full bg-white/10 rounded-full h-2.5"><div class="bg-gradient-to-r ${item.color} h-2.5 rounded-full" style="width:${item.percent}%"></div></div>
      </div>`).join('');
  }

  const upcoming = document.getElementById('upcoming-leave');
  if (upcoming) {
    upcoming.innerHTML = timeOffRequests
      .filter(r => r.status === 'Approved')
      .map(r => `
        <div class="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-full bg-gradient-to-br ${r.colors} flex items-center justify-center text-white text-xs font-bold">${r.initials}</div>
            <div class="ml-3">
              <p class="text-sm font-medium text-white">${r.name}</p>
              <p class="text-xs text-slate-400">${r.type} - ${r.dates}</p>
            </div>
          </div>
          <span class="text-sm text-slate-300">${r.days}d</span>
        </div>`).join('');
  }
}

function renderPayroll() {
  const tbody = document.getElementById('payroll-tbody');
  if (tbody) {
    tbody.innerHTML = payrollRecords.map(p => {
      const statusClass = p.status === 'Paid'
        ? 'bg-emerald-500/20 text-emerald-300'
        : p.status === 'Review'
          ? 'bg-amber-500/20 text-amber-300'
          : 'bg-indigo-500/20 text-indigo-300';
      const action = p.status === 'Review' ? 'Review' : 'Payslip';

      return `
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-full bg-gradient-to-br ${p.colors} flex items-center justify-center text-white text-xs font-bold">${p.initials}</div>
              <div class="ml-4">
                <div class="text-sm font-medium text-white">${p.name}</div>
                <div class="text-sm text-slate-400">${p.role}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 text-sm text-slate-400">${p.dept}</td>
          <td class="px-6 py-4 text-sm text-slate-300 font-medium">${p.gross}</td>
          <td class="px-6 py-4 text-sm text-slate-400">${p.deductions}</td>
          <td class="px-6 py-4 text-sm text-emerald-300 font-medium">${p.net}</td>
          <td class="px-6 py-4"><span class="px-2.5 py-1 text-xs font-semibold rounded-full ${statusClass}">${p.status}</span></td>
          <td class="px-6 py-4 text-right text-sm font-medium"><button class="text-indigo-400 hover:text-indigo-300">${action}</button></td>
        </tr>`;
    }).join('');
  }

  const departments = document.getElementById('payroll-departments');
  if (departments) {
    departments.innerHTML = payrollDepartments.map(item => `
      <div>
        <div class="flex justify-between text-sm mb-1"><span class="text-slate-300">${item.dept}</span><span class="text-slate-400">${item.amount}</span></div>
        <div class="w-full bg-white/10 rounded-full h-2.5"><div class="bg-gradient-to-r ${item.color} h-2.5 rounded-full" style="width:${item.percent}%"></div></div>
      </div>`).join('');
  }

  const statutory = document.getElementById('payroll-statutory');
  if (statutory) {
    statutory.innerHTML = statutorySummary.map(item => `
      <div class="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
        <div class="flex items-center">
          <div class="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center"><i data-lucide="${item.icon}" class="h-5 w-5 text-emerald-400"></i></div>
          <span class="ml-3 text-sm font-medium text-white">${item.label}</span>
        </div>
        <span class="text-sm text-slate-300">${item.amount}</span>
      </div>`).join('');
  }
}

function switchTab(tab) {
  document.querySelectorAll('[id$="-view"]').forEach(v => v.classList.add('hidden'));
  const view = document.getElementById(tab + '-view');
  if (view) view.classList.remove('hidden');
  document.querySelectorAll('#sidebar nav a').forEach(a => {
    a.classList.remove('sidebar-active');
    a.classList.add('text-slate-400');
  });
  event.target.closest('a')?.classList.add('sidebar-active');
  event.target.closest('a')?.classList.remove('text-slate-400');
}

function toggleAIAssistant() {
  document.getElementById('ai-assistant')?.classList.toggle('hidden');
}


const viewRenderers = {
  dashboard: () => {
    renderActivityTable();
    
  },
  employees: () => renderEmployeeCards(),
  recruitment: () => renderRecruitment(),
  attendance: () => renderAttendance(),
  timeoff: () => renderTimeOff(),
  payroll: () => renderPayroll(),
  performance: () => {}, 
  training: () => {} 
};


let observer;

function initLazyLoading() {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const viewId = entry.target.id.replace('-view', '');
        const renderer = viewRenderers[viewId];
        if (renderer && !entry.target.dataset.loaded) {
          renderer();
          entry.target.dataset.loaded = 'true';
          observer.unobserve(entry.target);
        }
      }
    });
  }, { rootMargin: '50px' });
}


function openAddEmployeeModal() {
  const modal = getElement('add-employee-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeAddEmployeeModal() {
  const modal = getElement('add-employee-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    const form = getElement('add-employee-form');
    if (form) form.reset();
  }
}

async function handleAddEmployee(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = getElement('submit-employee-btn');

  
  const employeeData = {
    name: getElement('employee-name').value.trim(),
    role: getElement('employee-role').value.trim(),
    department: getElement('employee-department').value,
    email: getElement('employee-email').value.trim(),
    phone: getElement('employee-phone').value.trim(),
    city: getElement('employee-city').value.trim() || 'Lusaka',
    status: 'Active',
    joined_date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    leave_balance: '25 days'
  };

  
  if (!employeeData.name || !employeeData.role || !employeeData.department || !employeeData.email) {
    alert('Please fill in all required fields.');
    return;
  }

  
  const nameParts = employeeData.name.split(' ');
  employeeData.initials = (nameParts[0][0] + (nameParts[1] ? nameParts[1][0] : '')).toUpperCase();

  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Adding...';

  try {
    
    const result = await addEmployee(employeeData);

    
    await addActivity({
      employee_id: result.id,
      employee_name: employeeData.name,
      initials: employeeData.initials,
      action: 'New employee added',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Completed'
    });

    
    await fetchEmployees();
    await fetchActivities();

    
    renderEmployeeCards();
    renderActivityTable();

    
    updateDashboardStats();

    
    closeAddEmployeeModal();

    
    alert('Employee added successfully!');

  } catch (error) {
    console.error('Error adding employee:', error);
    alert('Failed to add employee. Please try again.');
  } finally {
    
    submitBtn.disabled = false;
    submitBtn.textContent = 'Add Employee';
  }
}

function updateDashboardStats() {
  const employeeCount = getElement('employee-count');
  if (employeeCount) {
    employeeCount.textContent = employees.length;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  
  initLazyLoading();

  
  ['dashboard-view', 'employees-view', 'recruitment-view', 'attendance-view', 'timeoff-view', 'payroll-view', 'performance-view', 'training-view'].forEach(id => {
    const el = getElement(id);
    if (el) observer.observe(el);
  });

  
  (async () => {
    await fetchEmployees();
    await fetchActivities();

    
    renderActivityTable();
    updateDashboardStats();

    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  })();

  
  const addEmployeeBtn = getElement('add-employee-btn');
  if (addEmployeeBtn) {
    addEmployeeBtn.addEventListener('click', openAddEmployeeModal);
  }

  const dashboardAddEmployeeBtn = getElement('dashboard-add-employee-btn');
  if (dashboardAddEmployeeBtn) {
    dashboardAddEmployeeBtn.addEventListener('click', openAddEmployeeModal);
  }

  const addEmployeeForm = getElement('add-employee-form');
  if (addEmployeeForm) {
    addEmployeeForm.addEventListener('submit', handleAddEmployee);
  }
});
