import {
    ArrowLeft,
    MapPin,
    Phone,
    Mail,
    User,
    Building2,
    Calendar,
    Star,
    TrendingUp,
    Users,
    Activity,
    Edit,
    Clock,
    Shield,
    Tag,
    Wrench,
    FileText,
    GitBranch
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function BranchDetails({ branch, onBack, onEdit }) {
    const { organizations } = useDashboard();

    // Find the organization name
    const organization = organizations.find(org => org.id === branch.orgId || org.id === branch.organizationId);

    if (!branch) return null;

    const stats = [
        { label: 'Revenue', value: branch.revenue || '₹0', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Active Jobs', value: branch.activeJobs || 0, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Employees', value: branch.employees || 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Performance', value: branch.performance || 'N/A', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' }
    ];

    const formatTime12h = (timeStr) => {
        if (!timeStr) return 'Not set';
        try {
            const [hours, minutes] = timeStr.split(':');
            const h = parseInt(hours, 10);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const h12 = h % 12 || 12;
            return `${h12}:${minutes} ${ampm}`;
        } catch (e) {
            return timeStr;
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-muted rounded-xl transition-colors border border-border"
                    >
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{branch.name}</h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${branch.status === 'Active' ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
                                }`}>
                                {branch.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm font-mono leading-none">
                            <span className="bg-muted/50 px-1.5 py-0.5 rounded border border-border/50">{branch.code}</span>
                            <span className="text-muted-foreground/30">•</span>
                            <span className="bg-primary/5 text-primary px-1.5 py-0.5 rounded font-bold uppercase text-[10px]">{branch.category}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(branch)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all text-sm font-bold shadow-lg shadow-primary/20"
                    >
                        <Edit className="w-4 h-4" />
                        Edit Branch
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-card p-4 md:p-5 rounded-2xl border border-border shadow-sm group hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-2 md:mb-3">
                            <span className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                            <div className={`p-1.5 md:p-2 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`w-3.5 h-3.5 md:w-4 h-4 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="text-xl md:text-2xl font-bold text-foreground tracking-tight truncate">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info Columns */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description Section */}
                    {branch.description && (
                        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Branch Description
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed italic">
                                "{branch.description}"
                            </p>
                        </div>
                    )}

                    {/* Contact & Compliance */}
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            Location & Compliance
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-muted rounded-lg shrink-0">
                                        <MapPin className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1">Full Address</div>
                                        <div className="text-sm text-foreground font-medium leading-relaxed">{branch.location}</div>
                                        <div className="flex gap-2 mt-2">
                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-muted rounded border border-border/50 text-muted-foreground uppercase">{branch.city}</span>
                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-muted rounded border border-border/50 text-muted-foreground uppercase">{branch.state}</span>
                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-muted rounded border border-border/50 text-muted-foreground uppercase">{branch.pincode}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-muted rounded-lg shrink-0">
                                        <User className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1">Assigned Supervisor</div>
                                        <div className="text-sm text-foreground font-bold">{branch.supervisor || 'Unassigned'}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-muted rounded-lg shrink-0">
                                        <Shield className="w-5 h-5 text-primary/70" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                                        <div>
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1">GST NO</div>
                                            <div className="text-xs font-mono font-bold text-foreground break-all">{branch.gst || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1">PAN NO</div>
                                            <div className="text-xs font-mono font-bold text-foreground break-all">{branch.pan || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1">TAN NO</div>
                                            <div className="text-xs font-mono font-bold text-foreground break-all">{branch.tan || 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 pt-2">
                                    <div className="p-2 bg-muted rounded-lg shrink-0">
                                        <Phone className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1">Primary Contact</div>
                                        <div className="text-sm text-foreground font-bold truncate">{branch.phone}</div>
                                        <div className="text-xs text-muted-foreground mt-0.5 truncate">{branch.email}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Operational Details */}
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            Operations & Timing
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Operating Hours</div>
                                <div className="flex items-center justify-between">
                                    <div className="text-center">
                                        <div className="text-[10px] text-muted-foreground uppercase mb-1">Opens</div>
                                        <div className="text-sm font-bold text-foreground">{formatTime12h(branch.startTime)}</div>
                                    </div>
                                    <div className="h-px w-8 bg-border"></div>
                                    <div className="text-center">
                                        <div className="text-[10px] text-muted-foreground uppercase mb-1">Closes</div>
                                        <div className="text-sm font-bold text-foreground">{formatTime12h(branch.endTime)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Shift & Capacity</div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-muted-foreground">Shift:</span>
                                        <span className="font-bold text-foreground">{branch.shiftType || 'Single Shift'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-muted-foreground">Break:</span>
                                        <span className="font-bold text-foreground">{branch.breakDuration || 0} mins</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-muted-foreground">Capacity:</span>
                                        <span className="font-bold text-foreground">{branch.serviceCapacity || 0} Veh/Day</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-muted/30 rounded-2xl border border-border/50 lg:col-span-1">
                                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Working Days</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                        <span
                                            key={day}
                                            className={`px-2 py-1 rounded text-[10px] font-bold ${branch.workingDays?.some(d => d.startsWith(day))
                                                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                                                : 'bg-muted text-muted-foreground/30 border border-border/50'
                                                }`}
                                        >
                                            {day}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Services & Pricing */}
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <Wrench className="w-5 h-5 text-primary" />
                                Services & Pricing
                            </h2>
                            <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/20">
                                <span className="text-[10px] font-bold text-primary uppercase">Tax Config:</span>
                                <span className="text-xs font-black text-primary uppercase">{branch.taxType || 'GST'}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Service Catalog</div>
                                <div className="grid grid-cols-1 gap-2">
                                    {(branch.services || []).map((service, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2 bg-muted/20 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-muted/40 transition-colors">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            {service}
                                        </div>
                                    ))}
                                    {(!branch.services || branch.services.length === 0) && (
                                        <div className="text-xs italic text-muted-foreground py-2 text-center bg-muted/10 rounded-xl">No services configured</div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Pricing Control</div>
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs text-muted-foreground font-medium">Labor Rate</span>
                                            <span className="text-base font-bold text-foreground">₹{branch.labourRate || branch.laborRate || 0}/hr</span>
                                        </div>
                                        <div className="w-full bg-border/50 h-1.5 rounded-full overflow-hidden mt-2">
                                            <div className="bg-primary h-full" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-muted-foreground font-medium">Parts Markup</span>
                                            <span className="text-sm font-black text-blue-600">+{branch.partsMarkup || 0}%</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-muted-foreground font-medium">Max Discount Limit</span>
                                            <span className="text-sm font-black text-amber-600">{branch.maxDiscount || 0}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Organization Summary */}
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-primary" />
                            Organization Details
                        </h3>
                        {organization ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 bg-primary/5 p-4 rounded-xl border border-primary/10">
                                    <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-xl shadow-lg shadow-primary/20">
                                        {organization.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="font-bold text-foreground truncate">{organization.name}</div>
                                        <div className="text-[10px] text-muted-foreground font-mono truncate">{organization.id}</div>
                                    </div>
                                </div>
                                <div className="space-y-2 pt-2">
                                    <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase">
                                        <span>Total Group Revenue</span>
                                        <span className="text-foreground">₹{(organization.revenue / 10000000).toFixed(2)} Cr</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase">
                                        <span>Active Tax ID</span>
                                        <span className="text-foreground">{organization.taxId}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-muted-foreground italic text-xs">No organization linked</div>
                        )}
                    </div>

                    {/* Metadata Card */}
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-primary" />
                            System Metadata
                        </h3>

                        <div className="flex items-center justify-between py-2 border-b border-border/30">
                            <span className="text-xs text-muted-foreground font-bold">Internal ID</span>
                            <span className="text-xs font-mono font-black text-foreground">{branch.id}</span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-border/30">
                            <span className="text-xs text-muted-foreground font-bold">Deployment Date</span>
                            <span className="text-xs font-bold text-foreground">
                                {branch.createdAt ? new Date(branch.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                }) : 'N/A'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-border/30">
                            <span className="text-xs text-muted-foreground font-bold">Network Type</span>
                            <span className="text-xs font-bold text-primary">{branch.category}</span>
                        </div>

                        {branch.parentBranch && (
                            <div className="flex items-center justify-between py-2 border-b border-border/30">
                                <span className="text-xs text-muted-foreground font-bold">Hierarchy</span>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                                    <GitBranch className="w-3 h-3 text-primary" />
                                    {branch.parentBranch}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between py-2 border-b border-border/30">
                            <span className="text-xs text-muted-foreground font-bold">Tax Protocol</span>
                            <span className="text-xs font-bold text-foreground">{branch.taxType || 'GST 18%'}</span>
                        </div>
                    </div>

                    {/* Quick Access Actions */}
                    <div className="bg-muted p-4 rounded-2xl border border-dashed border-border flex flex-col gap-3">
                        <button className="w-full py-2.5 bg-background border border-border rounded-xl text-[11px] font-black uppercase text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2">
                            <TrendingUp className="w-4 h-4 opacity-70" />
                            View Revenue Report
                        </button>
                        <button className="w-full py-2.5 bg-background border border-border rounded-xl text-[11px] font-black uppercase text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2">
                            <Users className="w-4 h-4 opacity-70" />
                            Staff Directory
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
