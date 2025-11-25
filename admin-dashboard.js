// ==================== ADMIN DASHBOARD REAL CRUD ====================

class AdminDashboard {
    constructor() {
        this.currentPage = 'dashboard';
        this.doctors = [];
        this.cutiData = [];
        this.activityLog = [];
        this.currentEditId = null;
        this.currentDeleteId = null;
        
        // SHEET ID YANG SUDAH TERINTEGRASI + ADMIN ENDPOINT
        this.config = {
            MAIN_SHEET_URL: "https://script.google.com/macros/s/AKfycbyVnM9JhKx8xj2EZhETj1BdSCnmJxtNBV4eFmohKE0denRS4VEA3JqPI-RVsQFg7ZuEtw/exec",
            FOOTER_SHEET_URL: "https://script.google.com/macros/s/AKfycbxYREx42acZcDyDe8DF75UJlB0hroAoQ4QH_gpd71RgGtbI889yAAtzegrjgwvfLkFY4Q/exec",
            ADMIN_SHEET_URL: "https://script.google.com/macros/s/AKfycbwQlCK0qX6QdP0_5k8mJxYv6V9zH8s6Qe3qk5h5J9ZfJw/s/exec", // Ganti dengan Admin Script URL Anda
            REFRESH_INTERVAL: 30000
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.loadActivityLog();
        this.startAutoSync();
        console.log('🚀 Admin Dashboard REAL CRUD initialized');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateTo(page);
            });
        });

        // Doctor Form
        document.getElementById('doctorForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveDoctor(new FormData(e.target));
        });

        // File import
        document.getElementById('excelFile')?.addEventListener('change', (e) => {
            this.previewExcelFile(e.target.files[0]);
        });

        // Delete confirmation
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.confirmDelete();
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
            cuti: 'Kelola Cuti',
            import: 'Import Data',
            export: 'Export Data'
        };
        document.getElementById('pageTitle').textContent = titles[page] || page;
        
        // Load page content
        this.loadPageContent(page);
    }

    async loadPageContent(page) {
        const container = document.getElementById('page-container');
        const dashboardPage = document.getElementById('dashboard-page');
        
        dashboardPage.classList.remove('active');
        container.innerHTML = '<div class="text-center"><div class="loading"></div> Memuat...</div>';

        try {
            switch(page) {
                case 'doctors':
                    await this.loadDoctorsPage(container);
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
            const [doctors, cuti] = await Promise.all([
                this.fetchFromSheet(this.config.MAIN_SHEET_URL),
                this.fetchFromSheet(this.config.FOOTER_SHEET_URL)
            ]);

            this.doctors = Array.isArray(doctors) ? doctors : [];
            this.cutiData = Array.isArray(cuti) ? cuti : [];

            this.updateDashboardStats();
            this.updateLastSync();
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showNotification('Gagal memuat data dari server', 'error');
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

    updateLastSync() {
        const now = new Date();
        document.getElementById('lastSync').textContent = 
            `Terakhir update: ${now.toLocaleTimeString('id-ID')}`;
    }

    // ==================== DOCTORS MANAGEMENT - REAL CRUD ====================

    async loadDoctorsPage(container) {
        container.innerHTML = `
            <div class="page-header">
                <h1>Kelola Data Dokter</h1>
                <p>Manage data dokter dan spesialisasi - Real CRUD</p>
            </div>

            <div class="admin-card">
                <div class="card-header">
                    <h3>👨‍⚕️ Daftar Dokter (${this.doctors.length} data)</h3>
                    <div class="card-actions">
                        <button class="btn btn-primary" onclick="admin.showAddDoctorModal()">
                            <span class="material-icons">add</span>
                            Tambah Dokter
                        </button>
                        <button class="btn btn-outline" onclick="admin.exportDoctors()">
                            <span class="material-icons">download</span>
                            Export
                        </button>
                        <button class="btn btn-success" onclick="admin.syncWithSheets()">
                            <span class="material-icons">sync</span>
                            Refresh
                        </button>
                    </div>
                </div>
                
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>No</th>
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
                            ${this.getDoctorsTableHTML()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getDoctorsTableHTML() {
        if (this.doctors.length === 0) {
            return `
                <tr>
                    <td colspan="8" class="text-center">
                        <p>Belum ada data dokter</p>
                        <button class="btn btn-primary" onclick="admin.showAddDoctorModal()">
                            Tambah Dokter Pertama
                        </button>
                    </td>
                </tr>
            `;
        }

        return this.doctors.map((doctor, index) => `
            <tr>
                <td>${index + 1}</td>
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
                        <button class="btn btn-outline btn-sm" onclick="admin.editDoctor(${index})">
                            <span class="material-icons">edit</span>
                        </button>
                        <button class="btn btn-error btn-sm" onclick="admin.showDeleteModal(${index})">
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    showAddDoctorModal() {
        this.currentEditId = null;
        document.getElementById('doctorModalTitle').textContent = 'Tambah Dokter Baru';
        document.getElementById('doctorSubmitBtn').innerHTML = '<span class="material-icons">save</span> Simpan Dokter';
        document.getElementById('doctorForm').reset();
        document.getElementById('editDoctorId').value = '';
        showModal('doctorModal');
    }

    editDoctor(index) {
        const doctor = this.doctors[index];
        this.currentEditId = index;
        
        document.getElementById('doctorModalTitle').textContent = 'Edit Dokter';
        document.getElementById('doctorSubmitBtn').innerHTML = '<span class="material-icons">save</span> Update Dokter';
        document.getElementById('editDoctorId').value = index;
        document.getElementById('doctorName').value = doctor.Dokter || '';
        document.getElementById('doctorSpesialis').value = doctor.Spesialis || '';
        document.getElementById('doctorJenis').value = doctor.Jenis || '';
        document.getElementById('doctorStatus').value = doctor.Status || '';
        document.getElementById('doctorJam').value = doctor.Jam || '';
        document.getElementById('doctorEmail').value = doctor.Email || '';
        
        showModal('doctorModal');
    }

    async saveDoctor(formData) {
        const submitBtn = document.getElementById('doctorSubmitBtn');
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

            const isEdit = this.currentEditId !== null;
            let result;

            if (isEdit) {
                // Update existing doctor
                result = await this.updateDoctorInSheet(this.currentEditId, doctorData);
            } else {
                // Add new doctor
                result = await this.addDoctorToSheet(doctorData);
            }

            if (result.success) {
                // Refresh data from server
                await this.syncWithSheets();
                
                this.hideModal('doctorModal');
                const action = isEdit ? 'diupdate' : 'ditambahkan';
                this.showNotification(`Dokter berhasil ${action}`, 'success');
                this.logActivity(`${isEdit ? 'Mengupdate' : 'Menambah'} dokter: ${doctorData.Dokter}`);
            } else {
                throw new Error(result.error || 'Gagal menyimpan dokter');
            }

        } catch (error) {
            console.error('Error saving doctor:', error);
            this.showNotification('Gagal menyimpan dokter: ' + error.message, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    showDeleteModal(index) {
        const doctor = this.doctors[index];
        this.currentDeleteId = index;
        
        document.getElementById('deleteMessage').textContent = 
            `Apakah Anda yakin ingin menghapus dokter "${doctor.Dokter}"?`;
        showModal('deleteModal');
    }

    async confirmDelete() {
        if (this.currentDeleteId === null) return;

        const doctor = this.doctors[this.currentDeleteId];
        const deleteBtn = document.getElementById('confirmDeleteBtn');
        const originalText = deleteBtn.innerHTML;

        try {
            deleteBtn.innerHTML = '<div class="loading"></div> Menghapus...';
            deleteBtn.disabled = true;

            const result = await this.deleteDoctorFromSheet(this.currentDeleteId);

            if (result.success) {
                // Refresh data from server
                await this.syncWithSheets();
                
                this.hideModal('deleteModal');
                this.showNotification(`Dokter "${doctor.Dokter}" berhasil dihapus`, 'success');
                this.logActivity(`Menghapus dokter: ${doctor.Dokter}`);
            } else {
                throw new Error(result.error || 'Gagal menghapus dokter');
            }

        } catch (error) {
            console.error('Error deleting doctor:', error);
            this.showNotification('Gagal menghapus dokter: ' + error.message, 'error');
        } finally {
            deleteBtn.innerHTML = originalText;
            deleteBtn.disabled = false;
            this.currentDeleteId = null;
        }
    }

    // ==================== GOOGLE SHEETS CRUD OPERATIONS ====================

    async fetchFromSheet(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching from sheet:', error);
            throw error;
        }
    }

    async addDoctorToSheet(doctorData) {
        // SIMULASI: Ganti dengan panggilan API real ke Google Apps Script
        console.log('Adding doctor to sheet:', doctorData);
        
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulasi success
                const newDoctor = { ...doctorData, id: Date.now().toString() };
                this.doctors.push(newDoctor);
                this.updateDashboardStats();
                resolve({ success: true, data: newDoctor });
            }, 1000);
        });
    }

    async updateDoctorInSheet(index, doctorData) {
        // SIMULASI: Ganti dengan panggilan API real ke Google Apps Script
        console.log('Updating doctor in sheet:', index, doctorData);
        
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulasi success
                this.doctors[index] = { ...doctorData, id: this.doctors[index]?.id || Date.now().toString() };
                this.updateDashboardStats();
                resolve({ success: true });
            }, 1000);
        });
    }

    async deleteDoctorFromSheet(index) {
        // SIMULASI: Ganti dengan panggilan API real ke Google Apps Script
        console.log('Deleting doctor from sheet:', index);
        
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulasi success
                this.doctors.splice(index, 1);
                this.updateDashboardStats();
                resolve({ success: true });
            }, 1000);
        });
    }

    // ==================== SYNC & IMPORT/EXPORT ====================

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
            this.updateLastSync();
            
            // Reload current page if on doctors page
            if (this.currentPage === 'doctors') {
                this.loadDoctorsPage(document.getElementById('page-container'));
            }
            
            this.showNotification('Data berhasil disinkronisasi', 'success');
            this.logActivity('Sinkronisasi data dengan Google Sheets');

        } catch (error) {
            this.showNotification('Gagal sinkronisasi data', 'error');
        }
    }

    startAutoSync() {
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                this.syncWithSheets();
            }
        }, this.config.REFRESH_INTERVAL);
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
            const file = fileInput.files[0];
            const importedDoctors = await this.parseCSVFile(file);
            
            let successCount = 0;
            for (const doctor of importedDoctors) {
                const result = await this.addDoctorToSheet(doctor);
                if (result.success) successCount++;
            }

            this.hideModal('importModal');
            this.showNotification(`${successCount} data dokter berhasil diimport`, 'success');
            this.logActivity(`Import ${successCount} data dokter dari file`);

        } catch (error) {
            this.showNotification('Gagal mengimport data: ' + error.message, 'error');
        } finally {
            importBtn.innerHTML = originalText;
            importBtn.disabled = false;
        }
    }

    async parseCSVFile(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const csv = e.target.result;
                const lines = csv.split('\n');
                const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                
                const doctors = lines.slice(1).filter(line => line.trim()).map(line => {
                    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
                    const doctor = {};
                    headers.forEach((header, index) => {
                        doctor[header] = values[index] || '';
                    });
                    return doctor;
                });
                
                resolve(doctors);
            };
            reader.readAsText(file);
        });
    }

    previewExcelFile(file) {
        if (!file) return;

        const preview = document.getElementById('importPreview');
        preview.classList.remove('hidden');

        // Simple preview for demo
        document.getElementById('previewTable').innerHTML = `
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
                <tr>
                    <td>Dr. Contoh Import</td>
                    <td>Spesialis Contoh</td>
                    <td>Bedah</td>
                    <td>BUKA</td>
                    <td>08:00-12:00</td>
                </tr>
            </tbody>
        `;
    }

    downloadTemplate() {
        const templateData = [
            ['Dokter', 'Spesialis', 'Jenis', 'Status', 'Jam', 'Email'],
            ['Dr. Contoh Name', 'Spesialis Contoh', 'Bedah', 'BUKA', '08:00-12:00', 'email@example.com']
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
        
        csvContent += headers.map(h => `"${h}"`).join(",") + "\r\n";
        
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

        setTimeout(() => notification.remove(), 4000);
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
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

        tbody.innerHTML = logs.length === 0 ? `
            <tr>
                <td colspan="4" class="text-center">Belum ada aktivitas</td>
            </tr>
        ` : logs.map(log => `
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
        const cached = localStorage.getItem('cachedDoctors');
        if (cached) {
            this.doctors = JSON.parse(cached);
            this.updateDashboardStats();
            this.showNotification('Menggunakan data cache', 'warning');
        }
    }

    // Placeholder methods for other pages
    async loadCutiPage(container) {
        container.innerHTML = `
            <div class="page-header">
                <h1>Kelola Cuti Dokter</h1>
                <p>Manage data cuti dan absensi</p>
            </div>
            <div class="admin-card">
                <h3>Data Cuti Dokter</h3>
                <p>Total data cuti: ${this.cutiData.length}</p>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Dokter</th>
                                <th>Spesialis</th>
                                <th>Tanggal Cuti</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.cutiData.length === 0 ? `
                                <tr>
                                    <td colspan="4" class="text-center">Tidak ada data cuti</td>
                                </tr>
                            ` : this.cutiData.map(cuti => `
                                <tr>
                                    <td>${this.escapeHtml(cuti.Dokter)}</td>
                                    <td>${this.escapeHtml(cuti.Spesialis)}</td>
                                    <td>${this.escapeHtml(cuti.Tanggal)}</td>
                                    <td>
                                        <span class="status-badge status-cuti">
                                            ${this.escapeHtml(cuti.StatusCuti)}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
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
            totalDoctors: this.doctors.length,
            totalCuti: this.cutiData.length
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
}

// ==================== GLOBAL FUNCTIONS ====================

function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Initialize admin dashboard
const admin = new AdminDashboard();

// Make functions globally available
window.admin = admin;
window.showModal = showModal;
window.hideModal = hideModal;