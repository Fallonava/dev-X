// ==================== ADMIN DASHBOARD JS ====================

class AdminDashboard {
    constructor() {
        this.currentPage = 'dashboard';
        this.doctors = [];
        this.schedule = [];
        this.cuti = [];
        this.activityLog = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.loadActivityLog();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateTo(page);
            });
        });

        // Forms
        document.getElementById('addDoctorForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addDoctor(new FormData(e.target));
        });

        // File import preview
        document.getElementById('excelFile').addEventListener('change', (e) => {
            this.previewExcelFile(e.target.files[0]);
        });
    }

    navigateTo(page) {
        this.currentPage = page;
        
        // Update active nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');
        
        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            doctors: 'Kelola Dokter',
            schedule: 'Kelola Jadwal',
            cuti: 'Kelola Cuti',
            import: 'Import Data',
            export: 'Export Data',
            backup: 'Backup & Restore',
            settings: 'Settings',
            users: 'User Management',
            logs: 'Activity Log'
        };
        document.getElementById('pageTitle').textContent = titles[page] || page;
        
        // Load page content
        this.loadPageContent(page);
    }

    async loadPageContent(page) {
        const container = document.getElementById('page-container');
        const dashboardPage = document.getElementById('dashboard-page');
        
        // Hide dashboard
        dashboardPage.classList.remove('active');
        container.innerHTML = '';

        switch(page) {
            case 'doctors':
                await this.loadDoctorsPage(container);
                break;
            case 'schedule':
                await this.loadSchedulePage(container);
                break;
            case 'cuti':
                await this.loadCutiPage(container);
                break;
            case 'import':
                await this.loadImportPage(container);
                break;
            case 'export':
                await this.loadExportPage(container);
                break;
            case 'backup':
                await this.loadBackupPage(container);
                break;
            default:
                dashboardPage.classList.add('active');
                break;
        }
    }

    // ==================== DASHBOARD FUNCTIONS ====================

    async loadDashboardData() {
        try {
            // Load data from Google Sheets or API
            const [doctors, schedule, cuti] = await Promise.all([
                this.fetchData('doctors'),
                this.fetchData('schedule'),
                this.fetchData('cuti')
            ]);

            this.doctors = doctors || [];
            this.schedule = schedule || [];
            this.cuti = cuti || [];

            this.updateDashboardStats();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showNotification('Gagal memuat data dashboard', 'error');
        }
    }

    updateDashboardStats() {
        const totalDoctors = this.doctors.length;
        const activeDoctors = this.doctors.filter(d => d.Status === 'BUKA').length;
        const cutiDoctors = this.doctors.filter(d => d.Status === 'CUTI').length;
        const inactiveDoctors = this.doctors.filter(d => 
            ['SELESAI', 'TIDAK', 'PENUH'].includes(d.Status)
        ).length;

        document.getElementById('totalDoctors').textContent = totalDoctors;
        document.getElementById('activeDoctors').textContent = activeDoctors;
        document.getElementById('cutiDoctors').textContent = cutiDoctors;
        document.getElementById('inactiveDoctors').textContent = inactiveDoctors;
    }

    // ==================== DOCTORS MANAGEMENT ====================

    async loadDoctorsPage(container) {
        container.innerHTML = `
            <div class="page-header">
                <h1>Kelola Data Dokter</h1>
                <p>Manage data dokter dan spesialisasi</p>
            </div>

            <div class="admin-card">
                <div class="card-header">
                    <h3>👨‍⚕️ Daftar Dokter</h3>
                    <div class="card-actions">
                        <button class="btn btn-primary" onclick="showModal('addDoctorModal')">
                            <span class="material-icons">add</span>
                            Tambah Dokter
                        </button>
                        <button class="btn btn-outline" onclick="admin.exportDoctors()">
                            <span class="material-icons">download</span>
                            Export
                        </button>
                    </div>
                </div>
                
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Nama Dokter</th>
                                <th>Spesialis</th>
                                <th>Jenis</th>
                                <th>Status</th>
                                <th>Jam</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="doctorsTable">
                            <!-- Doctors data will be loaded here -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        await this.loadDoctorsTable();
    }

    async loadDoctorsTable() {
        const tbody = document.getElementById('doctorsTable');
        
        if (this.doctors.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        <p>Belum ada data dokter</p>
                        <button class="btn btn-primary" onclick="showModal('addDoctorModal')">
                            Tambah Dokter Pertama
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.doctors.map(doctor => `
            <tr>
                <td>${this.escapeHtml(doctor.Dokter)}</td>
                <td>${this.escapeHtml(doctor.Spesialis)}</td>
                <td>${this.escapeHtml(doctor.Jenis)}</td>
                <td>
                    <span class="status-badge status-${this.getStatusClass(doctor.Status)}">
                        ${this.escapeHtml(doctor.Status)}
                    </span>
                </td>
                <td>${this.escapeHtml(doctor.Jam)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-outline btn-sm" onclick="admin.editDoctor('${doctor.id}')">
                            <span class="material-icons">edit</span>
                        </button>
                        <button class="btn btn-error btn-sm" onclick="admin.deleteDoctor('${doctor.id}')">
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async addDoctor(formData) {
        try {
            const doctorData = {
                Dokter: formData.get('nama'),
                Spesialis: formData.get('spesialis'),
                Jenis: formData.get('jenis'),
                Status: formData.get('status'),
                Jam: formData.get('jam'),
                Email: formData.get('email'),
                id: Date.now().toString()
            };

            // Simulate API call
            await this.saveData('doctors', [...this.doctors, doctorData]);
            this.doctors.push(doctorData);
            
            this.updateDashboardStats();
            this.loadDoctorsTable();
            this.hideModal('addDoctorModal');
            this.showNotification('Dokter berhasil ditambahkan', 'success');
            this.logActivity(`Menambah dokter: ${doctorData.Dokter}`);

        } catch (error) {
            this.showNotification('Gagal menambah dokter', 'error');
        }
    }

    // ==================== IMPORT/EXPORT FUNCTIONS ====================

    async previewExcelFile(file) {
        if (!file) return;

        const preview = document.getElementById('importPreview');
        preview.classList.remove('hidden');

        // Simulate file reading and preview
        // In real implementation, use SheetJS or similar library
        const previewData = [
            { Dokter: 'Dr. Contoh', Spesialis: 'Umum', Jenis: 'Non Bedah', Status: 'BUKA', Jam: '08:00-12:00' }
        ];

        const table = document.getElementById('previewTable');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Dokter</th>
                    <th>Spesialis</th>
                    <th>Jenis</th>
                    <th>Status</th>
                    <th>Jam</th>
                </tr>
            </thead>
            <tbody>
                ${previewData.map(row => `
                    <tr>
                        <td>${row.Dokter}</td>
                        <td>${row.Spesialis}</td>
                        <td>${row.Jenis}</td>
                        <td>${row.Status}</td>
                        <td>${row.Jam}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
    }

    async processImport() {
        const fileInput = document.getElementById('excelFile');
        if (!fileInput.files.length) {
            this.showNotification('Pilih file terlebih dahulu', 'warning');
            return;
        }

        const importBtn = document.getElementById('importBtn');
        importBtn.innerHTML = '<div class="loading"></div> Memproses...';
        importBtn.disabled = true;

        try {
            // Simulate import process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // In real implementation, parse Excel and save data
            const newDoctors = [
                {
                    id: '1',
                    Dokter: 'Dr. Import Contoh',
                    Spesialis: 'Bedah',
                    Jenis: 'Bedah',
                    Status: 'BUKA',
                    Jam: '08:00-12:00'
                }
            ];

            this.doctors = [...this.doctors, ...newDoctors];
            await this.saveData('doctors', this.doctors);
            
            this.updateDashboardStats();
            this.hideModal('importModal');
            this.showNotification('Data berhasil diimport', 'success');
            this.logActivity('Import data dokter dari Excel');

        } catch (error) {
            this.showNotification('Gagal mengimport data', 'error');
        } finally {
            importBtn.innerHTML = '<span class="material-icons">upload</span> Process Import';
            importBtn.disabled = false;
        }
    }

    downloadTemplate() {
        // Create and download Excel template
        const templateData = [
            ['Dokter', 'Spesialis', 'Jenis', 'Status', 'Jam', 'Email'],
            ['Dr. Contoh Name', 'Spesialis Contoh', 'Bedah', 'BUKA', '08:00-12:00', 'email@example.com']
        ];

        let csvContent = "data:text/csv;charset=utf-8,";
        templateData.forEach(row => {
            csvContent += row.join(",") + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "template_dokter.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    exportDoctors() {
        if (this.doctors.length === 0) {
            this.showNotification('Tidak ada data untuk diexport', 'warning');
            return;
        }

        const headers = ['Dokter', 'Spesialis', 'Jenis', 'Status', 'Jam', 'Email'];
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Add headers
        csvContent += headers.join(",") + "\r\n";
        
        // Add data
        this.doctors.forEach(doctor => {
            const row = [
                doctor.Dokter,
                doctor.Spesialis,
                doctor.Jenis,
                doctor.Status,
                doctor.Jam,
                doctor.Email || ''
            ];
            csvContent += row.join(",") + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `data_dokter_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification('Data berhasil diexport', 'success');
        this.logActivity('Export data dokter ke CSV');
    }

    // ==================== UTILITY FUNCTIONS ====================

    async fetchData(endpoint) {
        // Simulate API call - replace with actual Google Apps Script URL
        return new Promise(resolve => {
            setTimeout(() => {
                // Mock data
                const mockData = {
                    doctors: [
                        {
                            id: '1',
                            Dokter: 'Dr. Ahmad Budi',
                            Spesialis: 'Penyakit Dalam',
                            Jenis: 'Non Bedah',
                            Status: 'BUKA',
                            Jam: '08:00-12:00',
                            Email: 'ahmad@rsu.com'
                        }
                    ],
                    schedule: [],
                    cuti: []
                };
                resolve(mockData[endpoint] || []);
            }, 500);
        });
    }

    async saveData(endpoint, data) {
        // Simulate API save - replace with actual Google Apps Script
        console.log(`Saving ${endpoint}:`, data);
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    getStatusClass(status) {
        const statusMap = {
            'BUKA': 'active',
            'PENUH': 'inactive',
            'SELESAI': 'inactive',
            'CUTI': 'cuti',
            'TIDAK': 'inactive'
        };
        return statusMap[status] || 'inactive';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="material-icons">${type === 'success' ? 'check_circle' : 'warning'}</span>
            ${message}
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    logActivity(activity) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            activity: activity,
            user: 'Admin',
            status: 'success'
        };

        this.activityLog.unshift(logEntry);
        this.saveActivityLog();
        this.loadActivityLog();
    }

    loadActivityLog() {
        const tbody = document.getElementById('activityTable');
        if (!tbody) return;

        const logs = this.activityLog.slice(0, 10); // Show last 10 activities

        if (logs.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">Belum ada aktivitas</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = logs.map(log => `
            <tr>
                <td>${new Date(log.timestamp).toLocaleString('id-ID')}</td>
                <td>${this.escapeHtml(log.activity)}</td>
                <td>${this.escapeHtml(log.user)}</td>
                <td>
                    <span class="status-badge status-active">
                        ${this.escapeHtml(log.status)}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    saveActivityLog() {
        localStorage.setItem('adminActivityLog', JSON.stringify(this.activityLog));
    }

    loadStoredActivityLog() {
        const stored = localStorage.getItem('adminActivityLog');
        if (stored) {
            this.activityLog = JSON.parse(stored);
        }
    }
}

// ==================== GLOBAL FUNCTIONS ====================

function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function exportData() {
    admin.exportDoctors();
}

// Initialize admin dashboard
const admin = new AdminDashboard();

// Make functions globally available
window.admin = admin;
window.showModal = showModal;
window.hideModal = hideModal;
window.exportData = exportData;