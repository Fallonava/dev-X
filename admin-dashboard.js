// ==================== ADMIN DASHBOARD FULL CRUD ====================

class AdminDashboard {
    constructor() {
        this.currentPage = 'dashboard';
        this.doctors = [];
        this.cutiData = [];
        this.activityLog = [];
        this.masterData = {
            spesialisList: [],
            jenisList: ['Bedah', 'Non Bedah'],
            statusList: ['BUKA', 'PENUH', 'SELESAI', 'CUTI', 'TIDAK'],
            jamList: [],
            dokterList: []
        };
        this.currentEditId = null;
        this.currentDeleteId = null;
        this.currentDeleteType = null;
        
        // CONFIGURATION - SESUAIKAN DENGAN URL ANDA
        this.config = {
            // URL untuk membaca data (existing)
            MAIN_SHEET_URL: "https://script.google.com/macros/s/AKfycbyVnM9JhKx8xj2EZhETj1BdSCnmJxtNBV4eFmohKE0denRS4VEA3JqPI-RVsQFg7ZuEtw/exec",
            FOOTER_SHEET_URL: "https://script.google.com/macros/s/AKfycbxYREx42acZcDyDe8DF75UJlB0hroAoQ4QH_gpd71RgGtbI889yAAtzegrjgwvfLkFY4Q/exec",
            
            // URL untuk CRUD operations (Google Apps Script Admin)
            ADMIN_SHEET_URL: "https://script.google.com/macros/s/AKfycbwEAx0R9LqxEDhkwXX8W6-8ZclVnh0Jl7OJ9J333PHghZkqwPu4Z-Usxc2hgtPN8e8/exec",
            
            REFRESH_INTERVAL: 30000
        };
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadInitialData();
        this.loadActivityLog();
        this.startAutoSync();
        console.log('🚀 Admin Dashboard Full CRUD initialized');
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
        document.getElementById('doctorForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveDoctor(new FormData(e.target));
        });

        document.getElementById('cutiForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCuti(new FormData(e.target));
        });

        // Auto-fill spesialis ketika dokter dipilih
        document.getElementById('cutiDokter').addEventListener('change', (e) => {
            this.autoFillSpesialis(e.target.value);
        });

        // Delete confirmation
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.confirmDelete();
        });

        // File import preview
        document.getElementById('excelFile').addEventListener('change', (e) => {
            this.previewExcelFile(e.target.files[0]);
        });
    }

    async loadInitialData() {
        try {
            this.showNotification('Memuat data awal...', 'info');
            
            // Load semua data sekaligus
            await Promise.all([
                this.loadMasterData(),
                this.loadDashboardData()
            ]);
            
            this.showNotification('Data berhasil dimuat', 'success');
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.showNotification('Gagal memuat data awal', 'error');
        }
    }

    // ==================== MASTER DATA & DROPDOWN ====================

    async loadMasterData() {
        try {
            // Coba load dari Google Apps Script
            const response = await this.fetchFromAdminSheet('get_master_data');
            if (response.success) {
                this.masterData = {
                    ...this.masterData,
                    ...response.data
                };
            }
            
            // Update dropdowns
            this.updateAllDropdowns();
            
        } catch (error) {
            console.error('Error loading master data:', error);
            // Fallback: extract from existing data
            this.extractMasterDataFromDoctors();
        }
    }

    extractMasterDataFromDoctors() {
        if (this.doctors.length > 0) {
            this.masterData.spesialisList = [...new Set(this.doctors.map(d => d.Spesialis).filter(Boolean))];
            this.masterData.jamList = [...new Set(this.doctors.map(d => d.Jam).filter(Boolean))];
            this.masterData.dokterList = [...new Set(this.doctors.map(d => d.Dokter).filter(Boolean))];
            this.updateAllDropdowns();
        }
    }

    updateAllDropdowns() {
        this.updateDoctorFormDropdowns();
        this.updateCutiFormDropdowns();
    }

    updateDoctorFormDropdowns() {
        // Spesialis dropdown
        const spesialisSelect = document.getElementById('doctorSpesialis');
        if (spesialisSelect) {
            spesialisSelect.innerHTML = '<option value="">Pilih Spesialis</option>' +
                this.masterData.spesialisList.map(item => 
                    `<option value="${this.escapeHtml(item)}">${this.escapeHtml(item)}</option>`
                ).join('');
        }

        // Status dropdown
        const statusSelect = document.getElementById('doctorStatus');
        if (statusSelect) {
            statusSelect.innerHTML = '<option value="">Pilih Status</option>' +
                this.masterData.statusList.map(item => 
                    `<option value="${this.escapeHtml(item)}">${this.escapeHtml(item)}</option>`
                ).join('');
        }

        // Jam dropdown  
        const jamSelect = document.getElementById('doctorJam');
        if (jamSelect) {
            jamSelect.innerHTML = '<option value="">Pilih Jam</option>' +
                this.masterData.jamList.map(item => 
                    `<option value="${this.escapeHtml(item)}">${this.escapeHtml(item)}</option>`
                ).join('');
        }
    }

    updateCutiFormDropdowns() {
        const dropdown = document.getElementById('cutiDokter');
        if (!dropdown) return;
        
        const allDoctors = [...new Set([
            ...this.masterData.dokterList,
            ...this.doctors.map(d => d.Dokter).filter(Boolean)
        ])].sort();
        
        dropdown.innerHTML = '<option value="">Pilih Dokter</option>' +
            allDoctors.map(dokter => 
                `<option value="${this.escapeHtml(dokter)}">${this.escapeHtml(dokter)}</option>`
            ).join('');
    }

    autoFillSpesialis(dokterName) {
        if (!dokterName) return;
        
        const doctor = this.doctors.find(d => d.Dokter === dokterName);
        if (doctor && doctor.Spesialis) {
            document.getElementById('cutiSpesialis').value = doctor.Spesialis;
        }
    }

    // ==================== NAVIGATION & PAGES ====================

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

    // ==================== DOCTORS CRUD ====================

    async loadDoctorsPage(container) {
        container.innerHTML = `
            <div class="page-header">
                <h1>Kelola Data Dokter</h1>
                <p>Manage data dokter dan spesialisasi</p>
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
                        <button class="btn btn-error btn-sm" onclick="admin.showDeleteModal(${index}, 'doctor')">
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
        
        this.updateDoctorFormDropdowns();
        this.showModal('doctorModal');
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
        
        this.showModal('doctorModal');
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
                Email: formData.get('Email')
            };

            const isEdit = this.currentEditId !== null;
            let result;

            if (isEdit) {
                result = await this.updateDoctorInSheet(this.currentEditId, doctorData);
            } else {
                result = await this.addDoctorToSheet(doctorData);
            }

            if (result.success) {
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

    // ==================== CUTI CRUD ====================

    async loadCutiPage(container) {
        container.innerHTML = `
            <div class="page-header">
                <h1>Kelola Cuti Dokter</h1>
                <p>Manage data cuti dan absensi</p>
            </div>

            <div class="admin-card">
                <div class="card-header">
                    <h3>🏖️ Data Cuti Dokter (${this.cutiData.length} data)</h3>
                    <div class="card-actions">
                        <button class="btn btn-primary" onclick="admin.showAddCutiModal()">
                            <span class="material-icons">add</span>
                            Tambah Cuti
                        </button>
                        <button class="btn btn-outline" onclick="admin.exportCuti()">
                            <span class="material-icons">download</span>
                            Export Cuti
                        </button>
                        <button class="btn btn-success" onclick="admin.syncCutiWithSheets()">
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
                                <th>Tanggal Cuti</th>
                                <th>Status</th>
                                <th>Keterangan</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="cutiTable">
                            ${this.getCutiTableHTML()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getCutiTableHTML() {
        if (this.cutiData.length === 0) {
            return `
                <tr>
                    <td colspan="7" class="text-center">
                        <p>Belum ada data cuti</p>
                        <button class="btn btn-primary" onclick="admin.showAddCutiModal()">
                            Tambah Data Cuti Pertama
                        </button>
                    </td>
                </tr>
            `;
        }

        return this.cutiData.map((cuti, index) => `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${this.escapeHtml(cuti.Dokter)}</strong></td>
                <td>${this.escapeHtml(cuti.Spesialis)}</td>
                <td>${this.escapeHtml(cuti.Tanggal)}</td>
                <td>
                    <span class="status-badge status-${this.getCutiStatusClass(cuti.StatusCuti)}">
                        ${this.escapeHtml(cuti.StatusCuti)}
                    </span>
                </td>
                <td>${this.escapeHtml(cuti.Keterangan || '-')}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-outline btn-sm" onclick="admin.editCuti(${index})">
                            <span class="material-icons">edit</span>
                        </button>
                        <button class="btn btn-error btn-sm" onclick="admin.showDeleteModal(${index}, 'cuti')">
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    showAddCutiModal() {
        this.currentEditId = null;
        document.getElementById('cutiModalTitle').textContent = 'Tambah Data Cuti';
        document.getElementById('cutiSubmitBtn').innerHTML = '<span class="material-icons">save</span> Simpan Data Cuti';
        document.getElementById('cutiForm').reset();
        document.getElementById('editCutiId').value = '';
        
        this.updateCutiFormDropdowns();
        this.showModal('cutiModal');
    }

    editCuti(index) {
        const cuti = this.cutiData[index];
        this.currentEditId = index;
        
        document.getElementById('cutiModalTitle').textContent = 'Edit Data Cuti';
        document.getElementById('cutiSubmitBtn').innerHTML = '<span class="material-icons">save</span> Update Data Cuti';
        document.getElementById('editCutiId').value = index;
        document.getElementById('cutiDokter').value = cuti.Dokter || '';
        document.getElementById('cutiSpesialis').value = cuti.Spesialis || '';
        document.getElementById('cutiTanggal').value = cuti.Tanggal || '';
        document.getElementById('cutiStatus').value = cuti.StatusCuti || '';
        document.getElementById('cutiKeterangan').value = cuti.Keterangan || '';
        
        this.showModal('cutiModal');
    }

    async saveCuti(formData) {
        const submitBtn = document.getElementById('cutiSubmitBtn');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.innerHTML = '<div class="loading"></div> Menyimpan...';
            submitBtn.disabled = true;

            const cutiData = {
                Dokter: formData.get('Dokter'),
                Spesialis: formData.get('Spesialis'),
                Tanggal: formData.get('Tanggal'),
                StatusCuti: formData.get('StatusCuti'),
                Keterangan: formData.get('Keterangan')
            };

            const isEdit = this.currentEditId !== null;
            let result;

            if (isEdit) {
                result = await this.updateCutiInSheet(this.currentEditId, cutiData);
            } else {
                result = await this.addCutiToSheet(cutiData);
            }

            if (result.success) {
                await this.syncCutiWithSheets();
                this.hideModal('cutiModal');
                const action = isEdit ? 'diupdate' : 'ditambahkan';
                this.showNotification(`Data cuti berhasil ${action}`, 'success');
                this.logActivity(`${isEdit ? 'Mengupdate' : 'Menambah'} data cuti: ${cutiData.Dokter}`);
            } else {
                throw new Error(result.error || 'Gagal menyimpan data cuti');
            }

        } catch (error) {
            console.error('Error saving cuti:', error);
            this.showNotification('Gagal menyimpan data cuti: ' + error.message, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    // ==================== DELETE OPERATIONS ====================

    showDeleteModal(index, type) {
        this.currentDeleteId = index;
        this.currentDeleteType = type;
        
        let message = '';
        if (type === 'doctor') {
            const doctor = this.doctors[index];
            message = `Apakah Anda yakin ingin menghapus dokter "${doctor.Dokter}"?`;
        } else {
            const cuti = this.cutiData[index];
            message = `Apakah Anda yakin ingin menghapus data cuti untuk "${cuti.Dokter}"?`;
        }
        
        document.getElementById('deleteMessage').textContent = message;
        this.showModal('deleteModal');
    }

    async confirmDelete() {
        if (this.currentDeleteId === null || !this.currentDeleteType) return;

        const deleteBtn = document.getElementById('confirmDeleteBtn');
        const originalText = deleteBtn.innerHTML;

        try {
            deleteBtn.innerHTML = '<div class="loading"></div> Menghapus...';
            deleteBtn.disabled = true;

            let result;
            let itemName = '';

            if (this.currentDeleteType === 'doctor') {
                const doctor = this.doctors[this.currentDeleteId];
                itemName = doctor.Dokter;
                result = await this.deleteDoctorFromSheet(this.currentDeleteId);
            } else {
                const cuti = this.cutiData[this.currentDeleteId];
                itemName = cuti.Dokter;
                result = await this.deleteCutiFromSheet(this.currentDeleteId);
            }

            if (result.success) {
                await this.syncWithSheets();
                this.hideModal('deleteModal');
                this.showNotification(`Data berhasil dihapus`, 'success');
                this.logActivity(`Menghapus ${this.currentDeleteType}: ${itemName}`);
            } else {
                throw new Error(result.error || 'Gagal menghapus data');
            }

        } catch (error) {
            console.error('Error deleting:', error);
            this.showNotification('Gagal menghapus data: ' + error.message, 'error');
        } finally {
            deleteBtn.innerHTML = originalText;
            deleteBtn.disabled = false;
            this.currentDeleteId = null;
            this.currentDeleteType = null;
        }
    }

    // ==================== IMPORT/EXPORT ====================

    showImportModal() {
        this.showModal('importModal');
    }

    async processImport() {
        const fileInput = document.getElementById('excelFile');
        const importType = document.getElementById('importType').value;
        
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
            const importedData = await this.parseCSVFile(file);
            
            let successCount = 0;
            for (const item of importedData) {
                let result;
                if (importType === 'doctors') {
                    result = await this.addDoctorToSheet(item);
                } else {
                    result = await this.addCutiToSheet(item);
                }
                if (result.success) successCount++;
            }

            this.hideModal('importModal');
            this.showNotification(`${successCount} data berhasil diimport`, 'success');
            this.logActivity(`Import ${successCount} data ${importType} dari file`);

        } catch (error) {
            this.showNotification('Gagal mengimport data: ' + error.message, 'error');
        } finally {
            importBtn.innerHTML = originalText;
            importBtn.disabled = false;
        }
    }

    async parseCSVFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const csv = e.target.result;
                    const lines = csv.split('\n').filter(line => line.trim());
                    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                    
                    const data = lines.slice(1).map(line => {
                        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
                        const item = {};
                        headers.forEach((header, index) => {
                            item[header] = values[index] || '';
                        });
                        return item;
                    });
                    
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Gagal membaca file'));
            reader.readAsText(file);
        });
    }

    previewExcelFile(file) {
        if (!file) return;

        const preview = document.getElementById('importPreview');
        preview.classList.remove('hidden');

        // Simple preview
        document.getElementById('previewTable').innerHTML = `
            <thead>
                <tr>
                    <th>Contoh Data</th>
                    <th>Akan ditampilkan</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>File dipilih:</td>
                    <td>${file.name}</td>
                </tr>
                <tr>
                    <td>Ukuran:</td>
                    <td>${(file.size / 1024).toFixed(2)} KB</td>
                </tr>
            </tbody>
        `;
    }

    downloadTemplate(type) {
        let templateData, filename;
        
        if (type === 'doctors') {
            templateData = [
                ['Dokter', 'Spesialis', 'Jenis', 'Status', 'Jam', 'Email'],
                ['Dr. Contoh Name', 'Umum', 'Non Bedah', 'BUKA', '08:00-12:00', 'email@example.com']
            ];
            filename = 'template_dokter.csv';
        } else {
            templateData = [
                ['Dokter', 'Spesialis', 'Tanggal', 'StatusCuti', 'Keterangan'],
                ['Dr. Contoh Name', 'Umum', '22 - 25 November 2024', 'AKAN CUTI', 'Cuti tahunan']
            ];
            filename = 'template_cuti.csv';
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        templateData.forEach(row => {
            csvContent += row.map(field => `"${field}"`).join(",") + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
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

        this.downloadCSV(csvContent, `data_dokter_${new Date().toISOString().split('T')[0]}.csv`);
        this.showNotification(`Data ${this.doctors.length} dokter berhasil diexport`, 'success');
        this.logActivity('Export data dokter ke CSV');
    }

    exportCuti() {
        if (this.cutiData.length === 0) {
            this.showNotification('Tidak ada data cuti untuk diexport', 'warning');
            return;
        }

        const headers = ['Dokter', 'Spesialis', 'Tanggal', 'StatusCuti', 'Keterangan'];
        let csvContent = "data:text/csv;charset=utf-8,";
        
        csvContent += headers.map(h => `"${h}"`).join(",") + "\r\n";
        
        this.cutiData.forEach(cuti => {
            const row = [
                cuti.Dokter,
                cuti.Spesialis,
                cuti.Tanggal,
                cuti.StatusCuti,
                cuti.Keterangan || ''
            ];
            csvContent += row.map(field => `"${field}"`).join(",") + "\r\n";
        });

        this.downloadCSV(csvContent, `data_cuti_${new Date().toISOString().split('T')[0]}.csv`);
        this.showNotification(`Data ${this.cutiData.length} cuti berhasil diexport`, 'success');
        this.logActivity('Export data cuti ke CSV');
    }

    downloadCSV(csvContent, filename) {
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // ==================== SHEET OPERATIONS ====================

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

    async fetchFromAdminSheet(action, data = null) {
        try {
            const url = data ? 
                `${this.config.ADMIN_SHEET_URL}?action=${action}` :
                this.config.ADMIN_SHEET_URL;
            
            const options = data ? {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, data })
            } : { method: 'GET' };

            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching from admin sheet:', error);
            throw error;
        }
    }

    async addDoctorToSheet(doctorData) {
        try {
            const result = await this.fetchFromAdminSheet('add_doctor', doctorData);
            return result;
        } catch (error) {
            // Fallback: simpan ke local
            console.log('Adding doctor locally:', doctorData);
            return new Promise((resolve) => {
                setTimeout(() => {
                    const newDoctor = { ...doctorData, id: Date.now().toString() };
                    this.doctors.push(newDoctor);
                    this.updateDashboardStats();
                    resolve({ success: true, data: newDoctor });
                }, 1000);
            });
        }
    }

    async updateDoctorInSheet(index, doctorData) {
        try {
            const result = await this.fetchFromAdminSheet('update_doctor', { id: index, data: doctorData });
            return result;
        } catch (error) {
            // Fallback: update local
            console.log('Updating doctor locally:', index, doctorData);
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.doctors[index] = { ...doctorData, id: this.doctors[index]?.id || Date.now().toString() };
                    this.updateDashboardStats();
                    resolve({ success: true });
                }, 1000);
            });
        }
    }

    async deleteDoctorFromSheet(index) {
        try {
            const result = await this.fetchFromAdminSheet('delete_doctor', { id: index });
            return result;
        } catch (error) {
            // Fallback: delete local
            console.log('Deleting doctor locally:', index);
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.doctors.splice(index, 1);
                    this.updateDashboardStats();
                    resolve({ success: true });
                }, 1000);
            });
        }
    }

    async addCutiToSheet(cutiData) {
        try {
            const result = await this.fetchFromAdminSheet('add_cuti', cutiData);
            return result;
        } catch (error) {
            // Fallback: simpan ke local
            console.log('Adding cuti locally:', cutiData);
            return new Promise((resolve) => {
                setTimeout(() => {
                    const newCuti = { ...cutiData, id: Date.now().toString() };
                    this.cutiData.push(newCuti);
                    resolve({ success: true, data: newCuti });
                }, 1000);
            });
        }
    }

    async updateCutiInSheet(index, cutiData) {
        try {
            const result = await this.fetchFromAdminSheet('update_cuti', { id: index, data: cutiData });
            return result;
        } catch (error) {
            // Fallback: update local
            console.log('Updating cuti locally:', index, cutiData);
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.cutiData[index] = { ...cutiData, id: this.cutiData[index]?.id || Date.now().toString() };
                    resolve({ success: true });
                }, 1000);
            });
        }
    }

    async deleteCutiFromSheet(index) {
        try {
            const result = await this.fetchFromAdminSheet('delete_cuti', { id: index });
            return result;
        } catch (error) {
            // Fallback: delete local
            console.log('Deleting cuti locally:', index);
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.cutiData.splice(index, 1);
                    resolve({ success: true });
                }, 1000);
            });
        }
    }

    // ==================== SYNC & UTILITIES ====================

    async syncWithSheets() {
        try {
            this.showNotification('Menyinkronisasi semua data...', 'info');
            
            await Promise.all([
                this.loadMasterData(),
                this.loadDashboardData()
            ]);
            
            // Reload current page
            if (this.currentPage !== 'dashboard') {
                this.loadPageContent(this.currentPage);
            }
            
            this.showNotification('Semua data berhasil disinkronisasi', 'success');
            this.logActivity('Sinkronisasi semua data dengan Google Sheets');

        } catch (error) {
            this.showNotification('Gagal sinkronisasi data', 'error');
        }
    }

    async syncCutiWithSheets() {
        try {
            const cuti = await this.fetchFromSheet(this.config.FOOTER_SHEET_URL);
            this.cutiData = cuti || [];

            if (this.currentPage === 'cuti') {
                this.loadCutiPage(document.getElementById('page-container'));
            }
            
            this.showNotification('Data cuti berhasil disinkronisasi', 'success');
        } catch (error) {
            this.showNotification('Gagal sinkronisasi data cuti', 'error');
        }
    }

    startAutoSync() {
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                this.syncWithSheets();
            }
        }, this.config.REFRESH_INTERVAL);
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

    getCutiStatusClass(status) {
        const statusMap = {
            'AKAN CUTI': 'warning',
            'SEDANG CUTI': 'error', 
            'SELESAI CUTI': 'inactive'
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

    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
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

    // ==================== PAGE TEMPLATES ====================

    async loadImportPage(container) {
        container.innerHTML = `
            <div class="page-header">
                <h1>Import Data</h1>
                <p>Import data dari file Excel/CSV</p>
            </div>
            <div class="admin-card">
                <h3>Gunakan Modal Import</h3>
                <p>Klik tombol "Import Data" di dashboard untuk membuka modal import.</p>
                <button class="btn btn-primary" onclick="admin.showImportModal()">
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
                    <button class="btn btn-warning" onclick="admin.exportCuti()">
                        Export Data Cuti (CSV)
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
            masterData: this.masterData,
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

// Initialize admin dashboard
const admin = new AdminDashboard();

// Make functions globally available
window.admin = admin;
