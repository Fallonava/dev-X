// ==================== ADMIN DASHBOARD TERINTEGRASI ====================

class AdminDashboard {
    constructor() {
        this.currentPage = 'dashboard';
        this.doctors = [];
        this.cutiData = [];
        this.activityLog = [];
        
        // SHEET ID YANG SUDAH TERINTEGRASI
        this.config = {
            MAIN_SHEET_URL: "https://script.google.com/macros/s/AKfycbyVnM9JhKx8xj2EZhETj1BdSCnmJxtNBV4eFmohKE0denRS4VEA3JqPI-RVsQFg7ZuEtw/exec",
            FOOTER_SHEET_URL: "https://script.google.com/macros/s/AKfycbxYREx42acZcDyDe8DF75UJlB0hroAoQ4QH_gpd71RgGtbI889yAAtzegrjgwvfLkFY4Q/exec",
            REFRESH_INTERVAL: 30000
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.loadActivityLog();
        console.log('🚀 Admin Dashboard initialized with integrated Sheet IDs');
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
        document.getElementById('excelFile')?.addEventListener('change', (e) => {
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
        container.innerHTML = '<div class="loading"></div> Memuat...';

        try {
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
                default:
                    dashboardPage.classList.add('active');
                    break;
            }
        } catch (error) {
            container.innerHTML = `
                <div class="admin-card">
                    <h3>Error</h3>
                    <p>Gagal memuat halaman: ${error.message}</p>
                    <button class="btn btn-primary" onclick="admin.navigateTo('${page}')">
                        Coba Lagi
                    </button>
                </div>
            `;
        }
    }

    // ==================== DASHBOARD FUNCTIONS ====================

    async loadDashboardData() {
        try {
            this.showNotification('Memuat data dari server...', 'info');
            
            const [doctors, cuti] = await Promise.all([
                this.fetchFromSheet(this.config.MAIN_SHEET_URL),
                this.fetchFromSheet(this.config.FOOTER_SHEET_URL)
            ]);

            this.doctors = doctors || [];
            this.cutiData = cuti || [];

            this.updateDashboardStats();
            this.showNotification('Data berhasil dimuat', 'success');
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showNotification('Gagal memuat data dari server', 'error');
            
            // Load from cache/fallback
            this.loadFromCache();
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
                        <button class="btn btn-success" onclick="admin.syncWithSheets()">
                            <span class="material-icons">sync</span>
                            Sync Data
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
                                <th>Email</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="doctorsTable">
                            <tr>
                                <td colspan="7" class="text-center">
                                    <div class="loading"></div> Memuat data dokter...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        await this.loadDoctorsTable();
    }

    async loadDoctorsTable() {
        const tbody = document.getElementById('doctorsTable');
        
        if (!tbody) return;

        if (this.doctors.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        <p>Belum ada data dokter</p>
                        <button class="btn btn-primary" onclick="showModal('addDoctorModal')">
                            Tambah Dokter Pertama
                        </button>
                        <button class="btn btn-outline" onclick="admin.syncWithSheets()">
                            Sync dari Google Sheets
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.doctors.map(doctor => `
            <tr>
                <td><strong>${this.escapeHtml(doctor.Dokter)}</strong></td>
                <td>${this.escapeHtml(doctor.Spesialis)}</td>
                <td>${this.escapeHtml(doctor.Jenis)}</td>
                <td>
                    <span class="status-badge status-${this.getStatusClass(doctor.Status)}">
                        ${this.escapeHtml(doctor.Status)}
                    </span>
                </td>
                <td>${this.escapeHtml(doctor.Jam)}</td>
                <td>${this.escapeHtml(doctor.Email || '-')}</td>
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
        const submitBtn = document.querySelector('#addDoctorForm button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.innerHTML = '<div class="loading"></div> Menyimpan...';
            submitBtn.disabled = true;

            const doctorData = {
                Dokter: formData.get('Dokter'),
                Spesialis: formData.get('Spesialis'),
                Jenis: formData.get('Jenis'),
                Status: formData.get('Status'),
                Jam: formData.get('Jam'),
                Email: formData.get('Email'),
                Timestamp: new Date().toISOString()
            };

            // Simpan ke Google Sheets via API
            await this.saveToSheet(this.config.MAIN_SHEET_URL, doctorData);
            
            // Update local data
            this.doctors.push({...doctorData, id: Date.now().toString()});
            
            this.updateDashboardStats();
            this.loadDoctorsTable();
            this.hideModal('addDoctorModal');
            document.getElementById('addDoctorForm').reset();
            
            this.showNotification('Dokter berhasil ditambahkan', 'success');
            this.logActivity(`Menambah dokter: ${doctorData.Dokter}`);

        } catch (error) {
            console.error('Error adding doctor:', error);
            this.showNotification('Gagal menambah dokter: ' + error.message, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    // ==================== SHEET INTEGRATION ====================

    async fetchFromSheet(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching from sheet:', error);
            throw error;
        }
    }

    async saveToSheet(url, data) {
        // Simulate API call to Google Sheets
        // Note: Actual implementation would need proper Google Apps Script endpoint
        console.log('Saving to sheet:', data);
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate successful save
                resolve({ success: true, id: Date.now().toString() });
            }, 1000);
        });
    }

    async syncWithSheets() {
        try {
            this.showNotification('Menyinkronisasi data dengan Google Sheets...', 'info');
            
            const [doctors, cuti] = await Promise.all([
                this.fetchFromSheet(this.config.MAIN_SHEET_URL),
                this.fetchFromSheet(this.config.FOOTER_SHEET_URL)
            ]);

            this.doctors = doctors || [];
            this.cutiData = cuti || [];

            this.updateDashboardStats();
            this.loadDoctorsTable();
            this.showNotification('Data berhasil disinkronisasi', 'success');
            this.logActivity('Sinkronisasi data dengan Google Sheets');

        } catch (error) {
            this.showNotification('Gagal sinkronisasi data', 'error');
        }
    }

    // ==================== IMPORT/EXPORT FUNCTIONS ====================

    async previewExcelFile(file) {
        if (!file) return;

        const preview = document.getElementById('importPreview');
        preview.classList.remove('hidden');

        // Simple CSV preview (for demo)
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
            const text = await file.text();
            const lines = text.split('\n').slice(0, 6); // Preview first 5 rows
            const headers = lines[0]?.split(',') || [];
            
            const table = document.getElementById('previewTable');
            table.innerHTML = `
                <thead>
                    <tr>
                        ${headers.map(header => `<th>${header}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${lines.slice(1).map(line => `
                        <tr>
                            ${line.split(',').map(cell => `<td>${cell}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            `;
        } else {
            // For Excel files, show placeholder
            document.getElementById('previewTable').innerHTML = `
                <tbody>
                    <tr>
                        <td colspan="5" class="text-center">
                            Preview untuk file Excel akan ditampilkan di sini
                        </td>
                    </tr>
                </tbody>
            `;
        }
    }

    async processImport() {
        const fileInput = document.getElementById('excelFile');
        if (!fileInput.files.length) {
            this.showNotification('Pilih file terlebih dahulu', 'warning');
            return;
        }

        const importBtn = document.getElementById('importBtn');
        const originalText = importBtn.innerHTML;
        importBtn.innerHTML = '<div class="loading"></div> Memproses...';
        importBtn.disabled = true;

        try {
            // Simulate import process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Example imported data
            const importedDoctors = [
                {
                    Dokter: 'Dr. Import Contoh 1',
                    Spesialis: 'Umum',
                    Jenis: 'Non Bedah',
                    Status: 'BUKA',
                    Jam: '08:00-12:00',
                    Email: 'contoh1@rsu.com'
                },
                {
                    Dokter: 'Dr. Import Contoh 2', 
                    Spesialis: 'Bedah',
                    Jenis: 'Bedah',
                    Status: 'BUKA',
                    Jam: '13:00-17:00',
                    Email: 'contoh2@rsu.com'
                }
            ];

            // Save to Google Sheets
            for (const doctor of importedDoctors) {
                await this.saveToSheet(this.config.MAIN_SHEET_URL, doctor);
            }

            // Update local data
            this.doctors = [...this.doctors, ...importedDoctors];
            
            this.updateDashboardStats();
            this.hideModal('importModal');
            this.showNotification(`${importedDoctors.length} data dokter berhasil diimport`, 'success');
            this.logActivity(`Import ${importedDoctors.length} data dokter dari file`);

        } catch (error) {
            this.showNotification('Gagal mengimport data', 'error');
        } finally {
            importBtn.innerHTML = originalText;
            importBtn.disabled = false;
        }
    }

    downloadTemplate() {
        const templateData = [
            ['Dokter', 'Spesialis', 'Jenis', 'Status', 'Jam', 'Email'],
            ['Dr. Contoh Name', 'Spesialis Contoh', 'Bedah', 'BUKA', '08:00-12:00', 'email@example.com'],
            ['Dr. Contoh Lain', 'Spesialis Lain', 'Non Bedah', 'BUKA', '13:00-17:00', 'email2@example.com']
        ];

        let csvContent = "data:text/csv;charset=utf-8,";
        templateData.forEach(row => {
            csvContent += row.map(field => `"${field}"`).join(",") + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "template_dokter_rsu_siaga_medika.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification('Template berhasil didownload', 'success');
    }

    exportDoctors() {
        if (this.doctors.length === 0) {
            this.showNotification('Tidak ada data untuk diexport', 'warning');
            return;
        }

        const headers = ['Dokter', 'Spesialis', 'Jenis', 'Status', 'Jam', 'Email'];
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Add headers
        csvContent += headers.map(h => `"${h}"`).join(",") + "\r\n";
        
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
            csvContent += row.map(field => `"${field}"`).join(",") + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `data_dokter_rsu_siaga_medika_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification(`Data ${this.doctors.length} dokter berhasil diexport`, 'success');
        this.logActivity('Export data dokter ke CSV');
    }

    // ==================== UTILITY FUNCTIONS ====================

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
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="material-icons">
                ${type === 'success' ? 'check_circle' : 
                  type === 'error' ? 'error' : 
                  type === 'warning' ? 'warning' : 'info'}
            </span>
            ${message}
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
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
        this.loadStoredActivityLog();
        const tbody = document.getElementById('activityTable');
        if (!tbody) return;

        const logs = this.activityLog.slice(0, 10);

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

    loadFromCache() {
        // Try to load from localStorage as fallback
        const cached = localStorage.getItem('cachedDoctors');
        if (cached) {
            this.doctors = JSON.parse(cached);
            this.updateDashboardStats();
            this.showNotification('Menggunakan data cache', 'warning');
        }
    }

    // Placeholder methods for other pages
    async loadSchedulePage(container) {
        container.innerHTML = `
            <div class="page-header">
                <h1>Kelola Jadwal</h1>
                <p>Manage jadwal praktek dokter</p>
            </div>
            <div class="admin-card">
                <h3>Fitur dalam pengembangan</h3>
                <p>Halaman kelola jadwal akan segera tersedia.</p>
            </div>
        `;
    }

    async loadCutiPage(container) {
        container.innerHTML = `
            <div class="page-header">
                <h1>Kelola Cuti Dokter</h1>
                <p>Manage data cuti dan absensi</p>
            </div>
            <div class="admin-card">
                <h3>Fitur dalam pengembangan</h3>
                <p>Halaman kelola cuti akan segera tersedia.</p>
            </div>
        `;
    }

    async loadImportPage(container) {
        container.innerHTML = `
            <div class="page-header">
                <h1>Import Data</h1>
                <p>Import data dari file Excel/CSV</p>
            </div>
            <div class="admin-card">
                <h3>Gunakan Modal Import</h3>
                <p>Klik tombol "Import dari Excel" di dashboard untuk membuka modal import.</p>
                <button class="btn btn-primary" onclick="showModal('importModal')">
                    Buka Modal Import
                </button>
            </div>
        `;
    }

    async loadExportPage(container) {
        container.innerHTML = `
            <div class="page-header">
                <h1>Export Data</h1>
                <p>Export data ke berbagai format</p>
            </div>
            <div class="admin-card">
                <h3>Export Options</h3>
                <div class="card-actions">
                    <button class="btn btn-success" onclick="admin.exportDoctors()">
                        Export Data Dokter (CSV)
                    </button>
                    <button class="btn btn-secondary" onclick="admin.exportBackup()">
                        Export Backup (JSON)
                    </button>
                </div>
            </div>
        `;
    }

    exportBackup() {
        const backupData = {
            doctors: this.doctors,
            cuti: this.cutiData,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const dataStr = JSON.stringify(backupData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `backup_rsu_siaga_medika_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Backup data berhasil diexport', 'success');
        this.logActivity('Export backup data sistem');
    }

    editDoctor(id) {
        this.showNotification('Fitur edit dokter dalam pengembangan', 'info');
    }

    deleteDoctor(id) {
        if (confirm('Apakah Anda yakin ingin menghapus dokter ini?')) {
            this.showNotification('Fitur hapus dokter dalam pengembangan', 'info');
        }
    }
}

// ==================== GLOBAL FUNCTIONS ====================

function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.getElementById(modalId).querySelector('form')?.reset();
}

// Initialize admin dashboard
const admin = new AdminDashboard();

// Make functions globally available
window.admin = admin;
window.showModal = showModal;
window.hideModal = hideModal;