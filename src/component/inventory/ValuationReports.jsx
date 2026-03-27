import React, { useState } from 'react';
import { useInventory } from '../../component/context/InventoryContext';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileBarChart, DollarSign, Package, TrendingUp, Download, Printer, Mail, PieChart } from 'lucide-react';

export default function ValuationReports() {
  const { items } = useInventory();
  const [reportType, setReportType] = useState('valuation');

  // Calculate inventory valuation
  const totalInventoryValue = items.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0);
  const totalSellingValue = items.reduce((sum, item) => sum + (item.currentStock * item.sellingPrice), 0);
  const potentialProfit = totalSellingValue - totalInventoryValue;

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Inventory Valuation & Reports', 14, 20);

    doc.setFontSize(12);
    doc.text(`Total Inventory Value: ₹${totalInventoryValue}`, 14, 30);
    doc.text(`Potential Revenue: ₹${totalSellingValue}`, 14, 38);
    doc.text(`Potential Profit: ₹${potentialProfit}`, 14, 46);

    // Category-wise table
    autoTable(doc, {
      startY: 55,
      head: [['Category', 'Items Count', 'Value', 'Percentage']],
      body: categoryData.map(cat => [
        cat.category,
        cat.count,
        `₹${cat.value}`,
        `${cat.percentage}%`
      ])
    });

    // High Value Items
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Item', 'SKU', 'Stock', 'Unit Cost', 'Total Value']],
      body: highValueItems.map(item => [
        item.name,
        item.sku,
        item.currentStock,
        `₹${item.costPrice}`,
        `₹${item.totalValue}`
      ])
    });

    // Fast Moving Items
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Item', 'SKU', 'Category', 'Current Stock']],
      body: fastMovingItems.map(item => [
        item.name,
        item.sku,
        item.category,
        item.currentStock
      ])
    });

    // Stock Aging
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Age Group', 'Items']],
      body: Object.entries(stockAging).map(([k, v]) => [k, Math.round(v)])
    });

    return doc;
  };

  // Category-wise breakdown
  const categoryBreakdown = items.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = { value: 0, count: 0 };
    }
    acc[category].value += item.currentStock * item.costPrice;
    acc[category].count += 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryBreakdown).map(([category, data]) => ({
    category,
    value: data.value,
    count: data.count,
    percentage: ((data.value / totalInventoryValue) * 100).toFixed(1)
  })).sort((a, b) => b.value - a.value);

  // Top 10 high-value items
  const highValueItems = [...items]
    .map(item => ({
      ...item,
      totalValue: item.currentStock * item.costPrice
    }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 10);

  // Top 10 fast-moving items (simulated - based on recent movements)
  const fastMovingItems = [...items]
    .sort((a, b) => (b.currentStock / b.maxLevel) - (a.currentStock / a.maxLevel))
    .slice(0, 10);

  // Stock aging breakdown
  const stockAging = {
    '0-30 days': items.filter(item => item.currentStock > 0).length * 0.6,
    '30-60 days': items.filter(item => item.currentStock > 0).length * 0.25,
    '60-180 days': items.filter(item => item.currentStock > 0).length * 0.1,
    '>180 days': items.filter(item => item.currentStock > 0).length * 0.05
  };

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  const handleEmailReport = () => {
    const doc = generatePDF();
    doc.save('Inventory_Report.pdf');
    toast.success('PDF generated. Attach this file to email manually.');
  };

  const handlePrintPDF = () => {
    const doc = generatePDF();
    window.open(doc.output('bloburl'), '_blank');
    toast.success('Print dialog opened');
  };

  const handleExportCSV = () => {
    if (!items || items.length === 0) {
      toast.error('No data available to export');
      return;
    }

    let csvSections = [];

    // ===== CATEGORY WISE SUMMARY =====
    csvSections.push('CATEGORY WISE INVENTORY VALUE');
    csvSections.push('Category,Items Count,Value,Percentage');

    categoryData.forEach(cat => {
      csvSections.push(
        `${cat.category},${cat.count},${cat.value},${cat.percentage}%`
      );
    });

    csvSections.push('');

    // ===== TOP 10 HIGH VALUE ITEMS =====
    csvSections.push('TOP 10 HIGH VALUE ITEMS');
    csvSections.push('Name,SKU,Stock,Unit Cost,Total Value');

    highValueItems.forEach(item => {
      csvSections.push(
        `${item.name},${item.sku},${item.currentStock},${item.costPrice},${item.totalValue}`
      );
    });

    csvSections.push('');

    // ===== TOP 10 FAST MOVING ITEMS =====
    csvSections.push('TOP 10 FAST MOVING ITEMS');
    csvSections.push('Name,SKU,Category,Current Stock');

    fastMovingItems.forEach(item => {
      csvSections.push(
        `${item.name},${item.sku},${item.category},${item.currentStock}`
      );
    });

    csvSections.push('');

    // ===== STOCK AGING =====
    csvSections.push('STOCK AGING ANALYSIS');
    csvSections.push('Age Group,Items');

    Object.entries(stockAging).forEach(([age, value]) => {
      csvSections.push(`${age},${Math.round(value)}`);
    });

    const csvContent = csvSections.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Inventory_Valuation_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('CSV exported with full valuation analysis');
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Valuation & Reports</h1>
          <p className="text-sm text-gray-600 mt-1">Inventory analytics and insights</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full md:w-auto">
          <button className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm" onClick={handleEmailReport}>
            <Mail size={16} />
            <span className="whitespace-nowrap">Email Report</span>
          </button>
          <button className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm" onClick={handlePrintPDF}>
            <Printer size={16} />
            <span className="whitespace-nowrap">Print PDF</span>
          </button>
          <button onClick={handleExportCSV}
            className="flex-1 sm:flex-none justify-center w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm mt-2 sm:mt-0">
            <Download size={16} />
            <span className="whitespace-nowrap">Export Excel</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white rounded-2xl p-1.5 border border-gray-200 inline-flex w-full sm:w-auto overflow-hidden">
        <button
          onClick={() => setReportType('valuation')}
          className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-colors whitespace-nowrap ${reportType === 'valuation' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          Inventory Valuation
        </button>
        <button
          onClick={() => setReportType('aging')}
          className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-colors whitespace-nowrap ${reportType === 'aging' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          Stock Aging
        </button>
      </div>

      {reportType === 'valuation' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 sm:p-6 text-white shadow-sm">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <DollarSign size={20} className="sm:w-6 sm:h-6" />
                </div>
                <span className="text-sm font-medium opacity-90">Total Inventory Value</span>
              </div>
              <div className="text-3xl sm:text-4xl font-bold">₹{(totalInventoryValue / 1000).toFixed(1)}K</div>
              <div className="text-xs opacity-75 mt-2">Cost Price Valuation</div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-5 sm:p-6 text-white shadow-sm">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <TrendingUp size={20} className="sm:w-6 sm:h-6" />
                </div>
                <span className="text-sm font-medium opacity-90">Potential Revenue</span>
              </div>
              <div className="text-3xl sm:text-4xl font-bold">₹{(totalSellingValue / 1000).toFixed(1)}K</div>
              <div className="text-xs opacity-75 mt-2">Selling Price Valuation</div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-5 sm:p-6 text-white shadow-sm">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <Package size={20} className="sm:w-6 sm:h-6" />
                </div>
                <span className="text-sm font-medium opacity-90">Potential Profit</span>
              </div>
              <div className="text-3xl sm:text-4xl font-bold">₹{(potentialProfit / 1000).toFixed(1)}K</div>
              <div className="text-xs opacity-75 mt-2">If all stock sold</div>
            </div>
          </div>

          {/* Category-wise Breakdown */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Category-wise Inventory Value</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Pie Chart Visualization */}
              <div className="relative">
                <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                    {categoryData.reduce((acc, cat, index) => {
                      const startAngle = acc.currentAngle;
                      const angle = (cat.percentage / 100) * 360;
                      const endAngle = startAngle + angle;

                      const x1 = 50 + 45 * Math.cos((startAngle * Math.PI) / 180);
                      const y1 = 50 + 45 * Math.sin((startAngle * Math.PI) / 180);
                      const x2 = 50 + 45 * Math.cos((endAngle * Math.PI) / 180);
                      const y2 = 50 + 45 * Math.sin((endAngle * Math.PI) / 180);

                      const largeArc = angle > 180 ? 1 : 0;

                      acc.paths.push(
                        <path
                          key={index}
                          d={`M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={colors[index % colors.length]}
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                      );

                      acc.currentAngle = endAngle;
                      return acc;
                    }, { paths: [], currentAngle: 0 }).paths}
                    <circle cx="50" cy="50" r="25" fill="white" />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-[10px] sm:text-xs text-gray-600">Total Value</div>
                    <div className="text-base sm:text-lg font-bold text-gray-900">₹{(totalInventoryValue / 1000).toFixed(0)}K</div>
                  </div>
                </div>
              </div>

              {/* Category List */}
              <div className="space-y-3">
                {categoryData.map((cat, index) => (
                  <div key={cat.category} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded shrink-0"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      ></div>
                      <div>
                        <div className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1">{cat.category}</div>
                        <div className="text-xs text-gray-600">{cat.count} items</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <div className="text-sm sm:text-base font-bold text-gray-900">₹{(cat.value / 1000).toFixed(1)}K</div>
                      <div className="text-xs text-gray-600">{cat.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top High-Value Items */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Top 10 High-Value Items</h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[700px] px-4 sm:px-0">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-y sm:border-y-0 sm:border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Rank</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Item</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">SKU</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Unit Cost</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {highValueItems.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                            index === 1 ? 'bg-gray-200 text-gray-700' :
                              index === 2 ? 'bg-orange-100 text-orange-700' :
                                'bg-blue-50 text-blue-700'
                            }`}>
                            #{index + 1}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={item.image || 'https://via.placeholder.com/40'} alt={item.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover bg-gray-100 shrink-0" />
                            <span className="font-semibold text-gray-900 text-sm">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs sm:text-sm font-mono text-gray-600">{item.sku}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{item.currentStock}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">₹{item.costPrice}</td>
                        <td className="px-4 py-3 text-sm font-bold text-blue-600">₹{item.totalValue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Fast-Moving Items */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Top 10 Fast-Moving Items</h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[700px] px-4 sm:px-0">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-y sm:border-y-0 sm:border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Item</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">SKU</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Current Stock</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Turnover</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {fastMovingItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={item.image || 'https://via.placeholder.com/40'} alt={item.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover bg-gray-100 shrink-0" />
                            <span className="font-semibold text-gray-900 text-sm">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs sm:text-sm font-mono text-gray-600">{item.sku}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.category}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{item.currentStock}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="text-green-600" size={16} />
                            <span className="text-xs sm:text-sm font-semibold text-green-600 uppercase tracking-wide">High</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {reportType === 'aging' && (
        <>
          {/* Stock Aging Summary */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Stock Aging Analysis</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-green-50 rounded-2xl p-4 sm:p-6 border border-green-100">
                <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">0-30 Days</div>
                <div className="text-2xl sm:text-3xl font-bold text-green-600">{Math.round(stockAging['0-30 days'])}</div>
                <div className="text-xs text-gray-500 mt-1">items</div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-4 sm:p-6 border border-blue-100">
                <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">30-60 Days</div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">{Math.round(stockAging['30-60 days'])}</div>
                <div className="text-xs text-gray-500 mt-1">items</div>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-4 sm:p-6 border border-yellow-100">
                <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">60-180 Days</div>
                <div className="text-2xl sm:text-3xl font-bold text-yellow-600">{Math.round(stockAging['60-180 days'])}</div>
                <div className="text-xs text-gray-500 mt-1">items</div>
              </div>

              <div className="bg-red-50 rounded-2xl p-4 sm:p-6 border border-red-100">
                <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">&gt;180 Days</div>
                <div className="text-2xl sm:text-3xl font-bold text-red-600">{Math.round(stockAging['>180 days'])}</div>
                <div className="text-xs font-medium text-red-500 mt-1">Dead Stock</div>
              </div>
            </div>

            <div className="mt-6 p-4 sm:p-5 bg-red-50 border border-red-200 rounded-xl">
              <h3 className="font-bold text-red-900 mb-3 text-sm sm:text-base">Dead Stock Recommendations</h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-red-800">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Consider running promotional campaigns for items aged &gt;180 days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Review minimum stock levels for slow-moving items to prevent over-purchasing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Identify and liquidate obsolete inventory to free up warehouse space and capital.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Aging Breakdown Chart */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Aging Breakdown</h2>
            <div className="space-y-5">
              {Object.entries(stockAging).map(([period, count], index) => {
                const totalItems = items.filter(i => i.currentStock > 0).length;
                const percentage = totalItems > 0 ? (count / totalItems) * 100 : 0;
                
                return (
                  <div key={period}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-semibold text-gray-700">{period}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900">{Math.round(count)} items</span>
                        <span className="text-xs text-gray-500 ml-2 hidden sm:inline">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-3 sm:h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${index === 0 ? 'bg-green-500' :
                          index === 1 ? 'bg-blue-500' :
                            index === 2 ? 'bg-yellow-500' :
                              'bg-red-500'
                          }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}