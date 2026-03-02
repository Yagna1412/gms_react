import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { toast } from 'sonner';
import { X, Check, ChevronRight, ChevronLeft, MapPin, Building2, Settings as SettingsIcon, Tag, FileCheck, Search, Map as MapIcon, Maximize2, Minimize2 } from 'lucide-react';
import MapPicker from './MapPicker';

export default function BranchCreationWizard({ onClose, initialData = null, mode = 'create' }) {
    const { addBranch, updateBranch, branches, organizations, selectedOrgForBranch, setSelectedOrgForBranch } = useDashboard();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1 : Basic Info
        organizationId: selectedOrgForBranch?.id || '',
        branchName: '',
        branchCode: '',
        category: '',
        parentBranch: '',
        status: 'Active',
        description: '',

        // Step 2 : Contact & Location
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        email: '',
        gst: '',
        pan: '',
        tan: '',
        latitude: '',
        longitude: '',

        // Step 3: Operational Config
        workingDays: [],
        startTime: '09:00',
        endTime: '18:00',
        breakDuration: '60',
        serviceCapacity: '20',
        holidays: [],
        shiftType: 'single',

        // Step 4: Service & Pricing
        services: [],
        partsMarkup: 15,
        labourRate: 500,
        maxDiscount: 10,
        taxType: 'gst'
    });
    const [errors, setErrors] = useState({});
    const [isConfirmed, setIsConfirmed] = useState({
        accurate: false,
        verified: false,
        understand: false
    });
    const [showMap, setShowMap] = useState(false);
    const [isFullscreenMap, setIsFullscreenMap] = useState(false);

    // Load draft or initial data on mount
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData }));
            // If editing/viewing, we might want to pre-fill everything. 
            // Also map 'name' back to 'branchName' and 'code' back to 'branchCode' if needed, 
            // depending on how data is stored vs form state.
            setFormData(prev => ({
                ...prev,
                ...initialData,
                branchName: initialData.name || initialData.branchName || prev.branchName,
                branchCode: initialData.code || initialData.branchCode || prev.branchCode,
                organizationId: initialData.orgId || initialData.organizationId || prev.organizationId,
                parentBranch: initialData.parentBranch || prev.parentBranch,
                latitude: initialData.latitude || prev.latitude || '',
                longitude: initialData.longitude || prev.longitude || ''
            }));
        } else {
            const savedDraft = localStorage.getItem('branchWizardDraft');
            if (savedDraft) {
                try {
                    const { data, step } = JSON.parse(savedDraft);
                    setFormData(prev => ({ ...prev, ...data }));
                    setCurrentStep(step);
                    toast.info('Loaded your previous draft', {
                        description: 'You can continue from where you left off.'
                    });
                } catch (e) {
                    console.error('Failed to load draft:', e);
                }
            }
        }
    }, [initialData]);

    const steps = [
        { number: 1, title: 'Basic Info', icon: Building2 },
        { number: 2, title: 'Contact & Location', icon: MapPin },
        { number: 3, title: 'Operations', icon: SettingsIcon },
        { number: 4, title: 'Service & Pricing', icon: Tag },
        { number: 5, title: 'Review', icon: FileCheck }

    ];

    const categories = ['Main Branch', 'Franchise', 'Sub Branch', 'Department'];
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const services = [
        'General Service', 'Oil Change', 'Brake Service', 'Tire Rotation',
        'Engine Diagnostics', 'AC Service', 'Batter Replacement', 'Wheel Alignment',
        'Transmission Service', 'Detailing', 'Paint & Body Work', 'Insurance Claims'
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.organizationId) newErrors.organizationId = "Organization is required";
            if (!formData.branchName) newErrors.branchName = "Branch name is required";
            if (!formData.branchCode) newErrors.branchCode = "Branch code is required";
            if (!formData.category) newErrors.category = "Category is required";
            if (!formData.status) newErrors.status = "Status is required";
        }

        if (step === 2) {
            if (!formData.address) newErrors.address = "Street address is required";
            if (!formData.city) newErrors.city = "City is required";
            if (!formData.state) newErrors.state = "State is required";
            if (!formData.pincode) newErrors.pincode = "Pincode is required";

            // Phone validation - 10 digits
            const phoneRegex = /^[0-9]{10}$/;
            if (!formData.phone) {
                newErrors.phone = "Phone number is required";
            } else if (!phoneRegex.test(formData.phone)) {
                newErrors.phone = "Enter a valid 10-digit phone number";
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formData.email) {
                newErrors.email = "Email is required";
            } else if (!emailRegex.test(formData.email)) {
                newErrors.email = "Enter a valid email address";
            }

            if (!formData.gst) newErrors.gst = "GST number is required";
            if (!formData.pan) newErrors.pan = "PAN number is required";
            if (!formData.tan) newErrors.tan = "TAN number is required";
        }

        if (step === 3) {
            if (formData.workingDays.length === 0) newErrors.workingDays = "Select at least one working day";
            if (!formData.startTime) newErrors.startTime = "Start time is required";
            if (!formData.endTime) newErrors.endTime = "End time is required";
            if (!formData.breakDuration) newErrors.breakDuration = "Break duration is required";
            if (!formData.serviceCapacity) newErrors.serviceCapacity = "Service capacity is required";
            if (!formData.shiftType) newErrors.shiftType = "Shift type is required";
        }

        if (step === 4) {
            if (formData.services.length === 0) newErrors.services = "Select at least one service";
            if (!formData.laborRate) newErrors.laborRate = "Labor rate is required";
            if (!formData.maxDiscount) newErrors.maxDiscount = "Max discount is required";
            if (!formData.taxType) newErrors.taxType = "Tax type is required";
        }

        if (step === 5) {
            if (!isConfirmed.accurate || !isConfirmed.verified || !isConfirmed.understand) {
                toast.error("Please confirm all declarations before creating the branch");
                return false;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            if (currentStep < 5) {
                setCurrentStep(currentStep + 1);
            }
        } else {
            if (currentStep < 5) toast.error("Please fill all required fields");
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    }

    const handleSubmit = () => {
        if (!validateStep(currentStep)) return;

        const location = [formData.address, formData.city, formData.state].filter(Boolean).join(', ') +
            (formData.pincode ? ` - ${formData.pincode}` : '');

        const branchData = {
            ...formData,
            orgId: formData.organizationId, // Ensure consistency with context data
            code: formData.branchCode.toUpperCase(),
            name: formData.branchName,
            location,
            // Preserve existing stats if editing
            supervisor: initialData?.supervisor || 'Unassigned',
            activeJobs: initialData?.activeJobs || 0,
            revenue: initialData?.revenue || 0,
            performance: initialData?.performance || 0,
            employees: initialData?.employees || 0,
            latitude: formData.latitude,
            longitude: formData.longitude
        };

        if (mode === 'edit' && initialData?.id) {
            updateBranch(initialData.id, branchData);
            toast.success('Branch updated successfully');
        } else {
            addBranch(branchData);
            toast.success('Branch created successfully');
            localStorage.removeItem('branchWizardDraft');
        }

        setSelectedOrgForBranch(null);
        onClose();
    }

    const handleSaveDraft = () => {
        const location = [formData.address, formData.city, formData.state].filter(Boolean).join(', ') +
            (formData.pincode ? ` - ${formData.pincode}` : '');

        const branchData = {
            ...formData,
            code: (formData.branchCode || 'DRAFT').toUpperCase(),
            name: formData.branchName || 'Untitled Branch',
            status: 'Draft',
            location,
            supervisor: 'Unassigned',
            activeJobs: 0,
            revenue: 0,
            performance: 0,
            employees: 0
        };

        addBranch(branchData);

        const draft = {
            data: formData,
            step: currentStep,
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem('branchWizardDraft', JSON.stringify(draft));
        toast.info('Branch saved as draft', {
            description: 'You can complete this setup anytime later.'
        });
        onClose();
    }

    const toggleDay = (day) => {
        const days = [...formData.workingDays];
        const index = days.indexOf(day);
        if (index > -1) {
            days.splice(index, 1);
        }
        else {
            days.push(day);
        }
        handleInputChange('workingDays', days);
    }

    const toggleService = (service) => {
        const servs = [...formData.services];
        const index = servs.indexOf(service);
        if (index > -1) {
            servs.splice(index, 1);
        }
        else {
            servs.push(service);
        }
        handleInputChange('services', servs);
    }

    const formatTime12h = (timeStr) => {
        if (!timeStr) return 'Not set';
        const [hours, minutes] = timeStr.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${minutes} ${ampm}`;
    };

    const handleLocationSelect = async (lat, lng) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();

            if (data.address) {
                const addr = data.address;
                const city = addr.city || addr.town || addr.village || addr.suburb || '';
                const state = addr.state || '';
                const pincode = addr.postcode || '';
                const street = [addr.road, addr.house_number, addr.neighbourhood].filter(Boolean).join(', ') || data.display_name.split(',')[0];

                handleInputChange('address', street);
                handleInputChange('city', city);
                handleInputChange('state', state);
                handleInputChange('pincode', pincode);
                handleInputChange('latitude', lat.toString());
                handleInputChange('longitude', lng.toString());

                toast.success('Location details fetched from map');
            }
        } catch (error) {
            console.error('Error fetching address:', error);
            toast.error('Failed to fetch address details, please enter manually');
        }
    };

    // Geocoding: Address UI -> Map pin
    useEffect(() => {
        if (currentStep !== 2) return;

        const geocodeAddress = async () => {
            const { address, city, state, pincode } = formData;
            const queryParts = [address, city, state, pincode].filter(Boolean);

            // Only search if we have at least city or address with some length
            if (queryParts.length === 0 || (queryParts.length === 1 && queryParts[0].length < 3)) return;

            const query = queryParts.join(', ');

            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
                const data = await response.json();

                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    // We update the local state but NOT via handleInputChange to avoid infinite loops 
                    // or triggering this effect again unnecessarily if the user is typing
                    setFormData(prev => ({
                        ...prev,
                        latitude: lat,
                        longitude: lon
                    }));
                }
            } catch (error) {
                console.error('Geocoding error:', error);
            }
        };

        const timer = setTimeout(geocodeAddress, 1500); // 1.5s debounce
        return () => clearTimeout(timer);
    }, [formData.address, formData.city, formData.state, formData.pincode, currentStep]);


    const renderStepContent = () => {
        const isViewMode = mode === 'view';
        const inputClasses = `w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50 ${isViewMode ? 'opacity-70 cursor-not-allowed' : ''}`;
        const labelClasses = "block text-xs font-semibold text-black mb-2 uppercase";

        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className={labelClasses}>Select Organization *</label>
                            <select
                                value={formData.organizationId}
                                onChange={(e) => handleInputChange('organizationId', e.target.value)}
                                disabled={isViewMode}
                                className={`${inputClasses} ${errors.organizationId ? 'border-red-500 bg-red-50 focus:ring-red-200' : ''}`}
                            >
                                <option value="">Select an organization</option>
                                {organizations.map(org => (
                                    <option key={org.id} value={org.id}>{org.name} ({org.id})</option>
                                ))}
                            </select>
                            {errors.organizationId && <p className="text-[10px] text-red-500 mt-1 font-medium ml-1">{errors.organizationId}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Branch Name *</label>
                                <input
                                    type="text"
                                    value={formData.branchName}
                                    onChange={(e) => handleInputChange('branchName', e.target.value)}
                                    disabled={isViewMode}
                                    placeholder="e.g., Mumbai Main Branch"
                                    className={`${inputClasses} ${errors.branchName ? 'border-red-500 bg-red-50 focus:ring-red-200' : ''}`}
                                />
                                {errors.branchName && <p className="text-[10px] text-red-500 mt-1 font-medium ml-1">{errors.branchName}</p>}
                            </div>
                            <div>
                                <label className={labelClasses}>Branch Code *</label>
                                <input
                                    type="text"
                                    value={formData.branchCode}
                                    onChange={(e) => handleInputChange('branchCode', e.target.value)}
                                    disabled={isViewMode}
                                    placeholder="e.g., MUM-MAIN-01"
                                    className={`${inputClasses} ${errors.branchCode ? 'border-red-500 bg-red-50 focus:ring-red-200' : ''}`}
                                />
                                {errors.branchCode ? (
                                    <p className="text-[10px] text-red-500 mt-1 font-medium ml-1">{errors.branchCode}</p>
                                ) : (
                                    <p className="text-[10px] text-muted-foreground mt-1.5 ml-1 italic">Auto-suggested based on location</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Category *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    disabled={isViewMode}
                                    className={`${inputClasses} ${errors.category ? 'border-red-500 bg-red-50 focus:ring-red-200' : ''}`}
                                >
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {errors.category && <p className="text-[10px] text-red-500 mt-1 font-medium ml-1">{errors.category}</p>}
                            </div>
                            <div>
                                <label className={labelClasses}>Parent Branch</label>
                                <select
                                    value={formData.parentBranch}
                                    onChange={(e) => handleInputChange('parentBranch', e.target.value)}
                                    className={`${inputClasses} ${formData.category === 'Main Branch' ? 'opacity-50' : ''}`}
                                    disabled={isViewMode || formData.category === 'Main Branch' || !formData.organizationId}
                                >
                                    <option value="">None (Top Level)</option>
                                    {branches
                                        .filter(b => b.orgId === formData.organizationId && b.category === 'Main Branch' && b.id !== initialData?.id)
                                        .map(b => (
                                            <option key={b.id} value={b.name}>{b.name}</option>
                                        ))
                                    }
                                </select>
                                {formData.category === 'Main Branch' && (
                                    <p className="text-[10px] text-muted-foreground mt-1 ml-1 italic">Main branches cannot have parents</p>
                                )}
                                {!formData.organizationId && (
                                    <p className="text-[10px] text-amber-600 mt-1 ml-1 font-medium">Select an organization first</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Status *</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                    disabled={isViewMode}
                                    className={`${inputClasses} ${errors.status ? 'border-red-500 bg-red-50 focus:ring-red-200' : ''}`}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Under Setup">Under Setup</option>
                                </select>
                                {errors.status && <p className="text-[10px] text-red-500 mt-1 font-medium ml-1">{errors.status}</p>}
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                disabled={isViewMode}
                                placeholder="Brief description of the branch goals and capabilities..."
                                rows="3"
                                className={inputClasses}
                            />
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className={labelClasses}>Full Address *</label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                disabled={isViewMode}
                                placeholder="Street address, area, landmark..."
                                rows="2"
                                className={`${inputClasses} ${errors.address ? 'border-red-500 bg-red-50 focus:ring-red-200' : ''}`}
                            ></textarea>
                            {errors.address && <p className="text-[10px] text-red-500 mt-1 font-medium ml-1">{errors.address}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClasses}>City *</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    disabled={isViewMode}
                                    placeholder="e.g., Mumbai"
                                    className={`${inputClasses} ${errors.city ? 'border-red-500 bg-red-50 focus:ring-red-200' : ''}`} />
                                {errors.city && <p className="text-[10px] text-red-500 mt-1 font-medium ml-1">{errors.city}</p>}
                            </div>
                            <div>
                                <label className={labelClasses}>State *</label>
                                <input
                                    type="text"
                                    value={formData.state}
                                    onChange={(e) => handleInputChange('state', e.target.value)}
                                    disabled={isViewMode}
                                    placeholder="e.g., Maharashtra"
                                    className={`${inputClasses} ${errors.state ? 'border-red-500 bg-red-50 focus:ring-red-200' : ''}`} />
                                {errors.state && <p className="text-[10px] text-red-500 mt-1 font-medium ml-1">{errors.state}</p>}
                            </div>
                            <div>
                                <label className={labelClasses}>Pincode *</label>
                                <input
                                    type="text"
                                    value={formData.pincode}
                                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                                    disabled={isViewMode}
                                    placeholder="e.g., 400001"
                                    className={`${inputClasses} ${errors.pincode ? 'border-red-500 bg-red-50 focus:ring-red-200' : ''}`} />
                                {errors.pincode && <p className="text-[10px] text-red-500 mt-1 font-medium ml-1">{errors.pincode}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Phone Number *</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    disabled={isViewMode}
                                    placeholder="e.g., 9876543210"
                                    className={`${inputClasses} ${errors.phone ? 'border-red-500 bg-red-50 focus:ring-red-200' : ''}`} />
                                {errors.phone && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.phone}</p>}
                            </div>
                            <div>
                                <label className={labelClasses}>Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    disabled={isViewMode}
                                    placeholder="e.g., branch@garageos.com"
                                    className={`${inputClasses} ${errors.email ? 'border-red-500 bg-red-50 focus:ring-red-200' : ''}`} />
                                {errors.email && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClasses}>GST Number *</label>
                                <input
                                    type="text"
                                    value={formData.gst}
                                    onChange={(e) => handleInputChange('gst', e.target.value)}
                                    disabled={isViewMode}
                                    placeholder="e.g., 22AAAAA0000A1Z5"
                                    className={`${inputClasses} ${errors.gst ? 'border-red-500 bg-red-50 focus:ring-red-200' : ''}`} />
                                {errors.gst && <p className="text-[10px] text-red-500 mt-1 font-medium ml-1">{errors.gst}</p>}
                            </div>
                            <div>
                                <label className={labelClasses}>PAN Number *</label>
                                <input
                                    type="text"
                                    value={formData.pan}
                                    onChange={(e) => handleInputChange('pan', e.target.value)}
                                    disabled={isViewMode}
                                    placeholder="e.g., AAAA00000A"
                                    className={`${inputClasses} ${errors.pan ? 'border-red-500 bg-red-50 focus:ring-red-200' : ''}`} />
                                {errors.pan && <p className="text-[10px] text-red-500 mt-1 font-medium ml-1">{errors.pan}</p>}
                            </div>
                            <div>
                                <label className={labelClasses}>TAN Number *</label>
                                <input
                                    type="text"
                                    value={formData.tan}
                                    onChange={(e) => handleInputChange('tan', e.target.value)}
                                    disabled={isViewMode}
                                    placeholder="e.g., AAAA00000A"
                                    className={`${inputClasses} ${errors.tan ? 'border-red-500 bg-red-50 focus:ring-red-200' : ''}`} />
                                {errors.tan && <p className="text-[10px] text-red-500 mt-1 font-medium ml-1">{errors.tan}</p>}
                            </div>
                        </div>

                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <p className="text-sm font-bold text-primary">Map Integration</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {showMap && (
                                        <button
                                            onClick={() => setIsFullscreenMap(!isFullscreenMap)}
                                            className="p-1 hover:bg-primary/10 rounded-lg text-primary transition-all"
                                            title={isFullscreenMap ? "Exit Fullscreen" : "Fullscreen"}
                                        >
                                            {isFullscreenMap ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                        </button>
                                    )}
                                    {showMap && (
                                        <button
                                            onClick={() => setShowMap(false)}
                                            className="text-[10px] font-bold text-primary uppercase hover:underline"
                                        >
                                            Hide Map
                                        </button>
                                    )}
                                </div>
                            </div>

                            {!showMap ? (
                                <div
                                    onClick={() => !isViewMode && setShowMap(true)}
                                    className="mt-2 bg-muted rounded-xl h-24 flex flex-col items-center justify-center border border-dashed border-border group hover:border-primary/50 transition-colors cursor-pointer"
                                >
                                    <MapIcon className="w-5 h-5 text-muted-foreground group-hover:scale-110 transition-transform" />
                                    <span className="mt-1 text-[10px] font-medium text-muted-foreground">Click to pick location from map</span>
                                </div>
                            ) : (
                                <div className="h-64 mt-2 relative animate-in zoom-in-95 duration-300">
                                    <MapPicker
                                        onLocationSelect={handleLocationSelect}
                                        initialLocation={formData.latitude && formData.longitude ? [parseFloat(formData.latitude), parseFloat(formData.longitude)] : [19.0760, 72.8777]}
                                    />
                                    <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg border border-border shadow-sm pointer-events-none">
                                        <p className="text-[10px] font-bold text-foreground text-center">Click on map to select branch location</p>
                                    </div>
                                </div>
                            )}

                            {/* Fullscreen Map Portal */}
                            {isFullscreenMap && (
                                <div className="fixed inset-0 z-[60] bg-background flex flex-col animate-in fade-in duration-300">
                                    <div className="p-4 border-b border-border flex items-center justify-between bg-card">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-primary" />
                                            <div>
                                                <h3 className="font-bold text-foreground">Select Branch Location</h3>
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Click on the map to set coordinates</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsFullscreenMap(false)}
                                            className="p-2 hover:bg-muted rounded-xl transition-all"
                                        >
                                            <Minimize2 className="w-6 h-6 text-foreground" />
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <MapPicker
                                            onLocationSelect={handleLocationSelect}
                                            initialLocation={formData.latitude && formData.longitude ? [parseFloat(formData.latitude), parseFloat(formData.longitude)] : [19.0760, 72.8777]}
                                        />
                                    </div>
                                    <div className="p-4 bg-muted/30 border-t border-border flex justify-end">
                                        <button
                                            onClick={() => setIsFullscreenMap(false)}
                                            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
                                        >
                                            Confirm Location
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className={labelClasses}>WORKING DAYS *</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 md:gap-3">
                                {daysOfWeek.map(day => (
                                    <button
                                        key={day}
                                        onClick={() => !isViewMode && handleInputChange('workingDays', formData.workingDays.includes(day) ? formData.workingDays.filter(d => d !== day) : [...formData.workingDays, day])}
                                        disabled={isViewMode}
                                        className={`px-2 py-3 md:px-4 rounded-lg border-2 text-[10px] sm:text-xs md:text-sm font-medium transition-all ${formData.workingDays.includes(day)
                                            ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-md scale-[1.02]'
                                            : errors.workingDays ? 'bg-white border-red-200 text-foreground hover:border-red-300' : 'bg-white border-gray-200 text-foreground hover:border-gray-300'
                                            } ${isViewMode ? 'opacity-80 cursor-not-allowed' : ''}`}
                                    >
                                        <span className="hidden sm:inline">{day}</span>
                                        <span className="sm:hidden">{day.substring(0, 3)}</span>
                                    </button>
                                ))}
                            </div>
                            {errors.workingDays && <p className="text-[10px] text-red-500 mt-2 font-medium ml-1">{errors.workingDays}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <div>
                                <label className={labelClasses}>START TIME *</label>
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                                    className={`${inputClasses} ${errors.startTime ? 'border-red-500 bg-red-50 focus:ring-red-200' : ''}`}
                                />
                                {errors.startTime && <p className="text-[10px] text-red-500 mt-1 font-medium ml-1">{errors.startTime}</p>}
                            </div>
                            <div>
                                <label className={labelClasses}>END TIME *</label>
                                <input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                                    className={`${inputClasses} ${errors.endTime ? 'border-red-500 bg-red-50 focus:ring-red-200' : ''}`}
                                />
                                {errors.endTime && <p className="text-[10px] text-red-500 mt-1 font-medium ml-1">{errors.endTime}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <div>
                                <label className={labelClasses}>BREAK DURATION (minutes) *</label>
                                <input
                                    type="number"
                                    value={formData.breakDuration}
                                    onChange={(e) => handleInputChange('breakDuration', e.target.value)}
                                    placeholder="60"
                                    className={`${inputClasses} ${errors.breakDuration ? 'border-red-500 bg-red-50 focus:ring-red-200' : ''}`}
                                />
                                {errors.breakDuration && <p className="text-[10px] text-red-500 mt-1 font-medium ml-1">{errors.breakDuration}</p>}
                            </div>
                            <div>
                                <label className={labelClasses}>SERVICE CAPACITY (per day) *</label>
                                <input
                                    type="number"
                                    value={formData.serviceCapacity}
                                    onChange={(e) => handleInputChange('serviceCapacity', e.target.value)}
                                    placeholder="20"
                                    className={`${inputClasses} ${errors.serviceCapacity ? 'border-red-500 bg-red-50 focus:ring-red-200' : ''}`}
                                />
                                {errors.serviceCapacity && <p className="text-[10px] text-red-500 mt-1 font-medium ml-1">{errors.serviceCapacity}</p>}
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>SHIFT TYPE *</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => !isViewMode && handleInputChange('shiftType', 'single')}
                                    disabled={isViewMode}
                                    className={`px-6 py-4 rounded-lg border-2 text-sm font-medium transition-all ${formData.shiftType === 'single'
                                        ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-md scale-[1.02]'
                                        : errors.shiftType ? 'bg-white border-red-200 text-foreground hover:border-red-300' : 'bg-white border-gray-200 text-foreground hover:border-gray-300'
                                        } ${isViewMode ? 'opacity-80 cursor-not-allowed' : ''}`}
                                >
                                    Single Shift
                                </button>
                                <button
                                    onClick={() => !isViewMode && handleInputChange('shiftType', 'multi')}
                                    disabled={isViewMode}
                                    className={`px-6 py-4 rounded-lg border-2 text-sm font-medium transition-all ${formData.shiftType === 'multi'
                                        ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-md scale-[1.02]'
                                        : errors.shiftType ? 'bg-white border-red-200 text-foreground hover:border-red-300' : 'bg-white border-gray-200 text-foreground hover:border-gray-300'
                                        } ${isViewMode ? 'opacity-80 cursor-not-allowed' : ''}`}
                                >
                                    Multi Shift
                                </button>
                            </div>
                            {errors.shiftType && <p className="text-[10px] text-red-500 mt-2 font-medium ml-1">{errors.shiftType}</p>}
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className={labelClasses}>SERVICE CATALOG *</label>
                            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-2 border-2 rounded-xl transition-all ${errors.services ? 'border-red-100 bg-red-50/30' : 'border-transparent'}`}>
                                {services.map(service => (
                                    <button
                                        key={service}
                                        onClick={() => !isViewMode && toggleService(service)}
                                        disabled={isViewMode}
                                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all text-left ${formData.services.includes(service)
                                            ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-md scale-[1.02]'
                                            : 'bg-white border-gray-200 text-foreground hover:border-gray-300'
                                            } ${isViewMode ? 'opacity-80 cursor-not-allowed' : ''}`}
                                    >
                                        {service}
                                    </button>
                                ))}
                            </div>
                            {errors.services && <p className="text-[10px] text-red-500 mt-2 font-medium ml-1">{errors.services}</p>}
                        </div>

                        <div>
                            <label className={labelClasses}>PARTS MARKUP: {formData.partsMarkup}%</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={formData.partsMarkup}
                                onChange={(e) => handleInputChange('partsMarkup', e.target.value)}
                                disabled={isViewMode}
                                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB] ${isViewMode ? 'opacity-70 cursor-not-allowed' : ''}`}
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground mt-1 uppercase font-bold">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <div>
                                <label className={labelClasses}>LABOR RATE (₹/hour) *</label>
                                <input
                                    type="number"
                                    value={formData.laborRate}
                                    onChange={(e) => handleInputChange('laborRate', e.target.value)}
                                    disabled={isViewMode}
                                    placeholder="500"
                                    min="100"
                                    max="10000"
                                    className={`${inputClasses} ${errors.laborRate ? 'border-red-500 bg-red-50 focus:ring-red-200' : ''}`}
                                />
                                {errors.laborRate && <p className="text-[10px] text-red-500 mt-1 font-medium ml-1">{errors.laborRate}</p>}
                            </div>
                            <div>
                                <label className={labelClasses}>MAX DISCOUNT (%) *</label>
                                <input
                                    type="number"
                                    value={formData.maxDiscount}
                                    onChange={(e) => handleInputChange('maxDiscount', e.target.value)}
                                    disabled={isViewMode}
                                    placeholder="10"
                                    min="0"
                                    max="50"
                                    className={`${inputClasses} ${errors.maxDiscount ? 'border-red-500 bg-red-50 focus:ring-red-200' : ''}`}
                                />
                                {errors.maxDiscount && <p className="text-[10px] text-red-500 mt-1 font-medium ml-1">{errors.maxDiscount}</p>}
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>TAX TYPE *</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => !isViewMode && handleInputChange('taxType', 'gst')}
                                    disabled={isViewMode}
                                    className={`px-6 py-4 rounded-lg border-2 text-sm font-medium transition-all ${formData.taxType === 'gst'
                                        ? 'bg-[#2563EB] border-[#2563EB] text-white'
                                        : 'bg-white border-gray-200 text-foreground hover:border-gray-300'
                                        } ${isViewMode ? 'opacity-80 cursor-not-allowed' : ''}`}
                                >
                                    <div>GST (CGST + SGST)</div>
                                    <div className={`text-[10px] mt-1 uppercase font-bold ${formData.taxType === 'gst' ? 'text-white/70' : 'text-muted-foreground/60'}`}>For intra-state transactions</div>
                                </button>
                                <button
                                    onClick={() => !isViewMode && handleInputChange('taxType', 'igst')}
                                    disabled={isViewMode}
                                    className={`px-6 py-4 rounded-lg border-2 text-sm font-medium transition-all ${formData.taxType === 'igst'
                                        ? 'bg-[#2563EB] border-[#2563EB] text-white'
                                        : 'bg-white border-gray-200 text-foreground hover:border-gray-300'
                                        } ${isViewMode ? 'opacity-80 cursor-not-allowed' : ''}`}
                                >
                                    <div>IGST</div>
                                    <div className={`text-[10px] mt-1 uppercase font-bold ${formData.taxType === 'igst' ? 'text-white/70' : 'text-muted-foreground/60'}`}>For inter-state transactions</div>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            case 5:
                return (
                    <div className="space-y-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-green-800 font-medium">
                                ✓ Review all details before submission. You can edit later from branch settings.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            {/* Basic Info Summary */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5">
                                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                    <Building2 className="w-5 h-5" />
                                    Basic Information
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="text-muted-foreground font-bold uppercase text-[10px]">Organization:</span>
                                        <p className="font-medium text-foreground">{organizations.find(o => o.id === formData.organizationId)?.name || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground font-bold uppercase text-[10px]">Branch Name:</span>
                                        <p className="font-medium text-foreground">{formData.branchName || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground font-bold uppercase text-[10px]">Branch Code:</span>
                                        <p className="font-medium text-foreground">{formData.branchCode || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground font-bold uppercase text-[10px]">Category:</span>
                                        <p className="font-medium text-foreground">{formData.category || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground font-bold uppercase text-[10px]">Status:</span>
                                        <p className="font-medium text-foreground">{formData.status}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Location Summary */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5">
                                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Location & Contact
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="text-muted-foreground font-bold uppercase text-[10px]">City:</span>
                                        <p className="font-medium text-foreground">{formData.city || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground font-bold uppercase text-[10px]">State:</span>
                                        <p className="font-medium text-foreground">{formData.state || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground font-bold uppercase text-[10px]">Phone:</span>
                                        <p className="font-medium text-foreground">{formData.phone || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground font-bold uppercase text-[10px]">Email:</span>
                                        <p className="font-medium text-foreground">{formData.email || 'Not set'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Operations Summary */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5">
                                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                    <SettingsIcon className="w-5 h-5" />
                                    Operations
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="text-muted-foreground font-bold uppercase text-[10px]">Working Days:</span>
                                        <p className="font-medium text-foreground">{formData.workingDays.length || 0} days selected</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground font-bold uppercase text-[10px]">Working Hours:</span>
                                        <p className="font-medium text-foreground">{formatTime12h(formData.startTime)} - {formatTime12h(formData.endTime)}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground font-bold uppercase text-[10px]">Service Capacity:</span>
                                        <p className="font-medium text-foreground">{formData.serviceCapacity} vehicles/day</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground font-bold uppercase text-[10px]">Shift Type:</span>
                                        <p className="font-medium text-foreground capitalize">{formData.shiftType}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Summary */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5">
                                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                    <Tag className="w-5 h-5" />
                                    Services & Pricing
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="text-muted-foreground font-bold uppercase text-[10px]">Services:</span>
                                        <p className="font-medium text-foreground">{formData.services.length} services selected</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground font-bold uppercase text-[10px]">Parts Markup:</span>
                                        <p className="font-medium text-foreground">{formData.partsMarkup}%</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground font-bold uppercase text-[10px]">Labor Rate:</span>
                                        <p className="font-medium text-foreground">₹{formData.laborRate}/hour</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground font-bold uppercase text-[10px]">Max Discount:</span>
                                        <p className="font-medium text-foreground">{formData.maxDiscount}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Confirmation Checkboxes */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 space-y-3">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isConfirmed.accurate}
                                    onChange={(e) => setIsConfirmed(prev => ({ ...prev, accurate: e.target.checked }))}
                                    className="mt-1 w-4 h-4 rounded border-gray-300"
                                />
                                <span className="text-sm text-foreground font-medium uppercase">
                                    I confirm that all information provided is accurate and complete
                                </span>
                            </label>
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isConfirmed.verified}
                                    onChange={(e) => setIsConfirmed(prev => ({ ...prev, verified: e.target.checked }))}
                                    className="mt-1 w-4 h-4 rounded border-gray-300"
                                />
                                <span className="text-sm text-foreground font-medium uppercase">
                                    I have verified GST, PAN, and TAN details (if applicable)
                                </span>
                            </label>
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isConfirmed.understand}
                                    onChange={(e) => setIsConfirmed(prev => ({ ...prev, understand: e.target.checked }))}
                                    className="mt-1 w-4 h-4 rounded border-gray-300"
                                />
                                <span className="text-sm text-foreground font-medium uppercase">
                                    I understand this action will create a new branch in the system
                                </span>
                            </label>
                        </div>
                    </div>
                )
        }
    }


    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 md:p-8">
            <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] flex flex-col shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-300 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-2xl">
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
                            {mode === 'create' ? 'Create New Branch' : mode === 'edit' ? 'Edit Branch' : 'View Branch Details'}
                        </h2>
                        <p className="text-[10px] md:text-xs font-medium text-muted-foreground mt-0.5 flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase">Wizard</span>
                            Progress: Step {currentStep} of 5
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedOrgForBranch(null);
                            onClose();
                        }}
                        className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl transition-all active:scale-90"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Step Indicator */}
                <div className="px-4 md:px-12 py-4 border-b border-gray-100 bg-white">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.number;
                            const isCompleted = currentStep > step.number;

                            return (
                                <React.Fragment key={step.number}>
                                    <div className="flex flex-col items-center gap-1">
                                        <div
                                            className={`w-8 h-8 md:w-12 md:h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-300 shadow-sm
                                                ${isCompleted ? 'bg-green-500 border-green-500 shadow-green-500/20' :
                                                    isActive ? 'bg-primary border-primary shadow-primary/20 scale-105' : 'bg-card border-border hover:border-primary/30'
                                                }`}>
                                            {isCompleted ? (
                                                <Check className="w-4 h-4 md:w-6 md:h-6 text-white" />
                                            ) : (
                                                <Icon className={`w-3.5 h-3.5 md:w-5 md:h-5 transition-colors ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                                            )}
                                        </div>
                                        <span className={`text-[8px] md:text-[10px] font-bold uppercase hidden sm:block ${isActive ? 'text-foreground' : 'text-muted-foreground/60'}`}>
                                            {step.title}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-2 md:mx-4 rounded-full transition-colors duration-500 ${isCompleted ? 'bg-green-500' : 'bg-muted'}`} />
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:px-10 md:py-8 scrollbar-hide">
                    {renderStepContent()}
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-200 bg-gray-50 gap-4 rounded-b-2xl">
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 w-full sm:w-auto ${currentStep === 1
                            ? 'text-muted-foreground/40 cursor-not-allowed'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-border'
                            }`}>
                        <ChevronLeft className="w-4 h-4" />
                        Previous Step
                    </button>

                    <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                        {mode !== 'view' && (
                            <button
                                onClick={handleSaveDraft}
                                className="px-5 py-2.5 border border-border rounded-xl font-bold text-xs text-foreground hover:bg-muted transition-all active:scale-95 text-center">
                                Save as Draft
                            </button>
                        )}
                        {currentStep < 5 ? (
                            <button
                                onClick={handleNext}
                                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-xs hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95">
                                Continue
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            mode === 'view' ? (
                                <button
                                    onClick={onClose}
                                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-xs hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95"
                                >
                                    Close
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={mode === 'create' && (!isConfirmed.accurate || !isConfirmed.verified || !isConfirmed.understand)}
                                    className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all active:scale-95 ${mode === 'edit' || (isConfirmed.accurate && isConfirmed.verified && isConfirmed.understand)
                                        ? 'bg-green-500 text-white hover:bg-green-600 shadow-green-500/20'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none active:scale-100'
                                        }`}
                                >
                                    <Check className="w-4 h-4" />
                                    {mode === 'edit' ? 'Update Branch' : 'Create Branch'}
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    )



}