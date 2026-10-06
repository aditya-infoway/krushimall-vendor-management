import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { toast } from "sonner";
import { ArrowUpTrayIcon, ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import apiHelper from "@/utils/apiHelper";
import { Button } from "@/components/ui";

/* paste: const TEMPLATE_HEADERS = [ ... ];  */
/* paste: const SAMPLE_DATA: Record<string, any> = { ... };  */
const TEMPLATE_HEADERS: string[] = [
  // Basic
  "Category", "Brand", "Model", "Model Year", "Variant",
  "Product Name", "Product Code", "SKU Code", "Launch Year",
  "Tractor Status", "Drive Type", "Short Description",
  "Highlight 1", "Highlight 2", "Highlight 3", "Highlight 4", "Highlight 5",
  "Red", "Blue", "Green", "Orange", "Black", "White",
  "Custom Color", "Custom Color Name", "Custom Color Code", "Upcoming",
  "Available States", "Available Districts", "Available Dealers", "Stock Status",
  "SEO Title", "SEO URL", "Meta Description", "Keywords",
  // Engine
  "Engine Type", "Fuel Type", "Horse Power", "Number of Cylinders", "Cubic Capacity",
  "Rated RPM", "Aspirated Type", "Emission Norms", "Cooling System", "Air Filter Type",
  "Maximum Torque", "Torque RPM", "Torque Backup", "Engine Condition",
  // Transmission
  "Clutch Type", "Forward Gears", "Reverse Gears", "Gear Type", "Transmission Type",
  "PTO HP", "PTO RPM", "PTO Type", "PTO Position",
  "Creeper Gears", "Shuttle Shift", "Side Shift Gear", "Power Shuttle",
  "Hi Lo Gears", "Multi Speed PTO", "Reverse PTO", "Super Reducer",
  // Hydraulic
  "Lifting Capacity", "Lifting Capacity At 610mm", "Hydraulic Type",
  "ADDC", "Position Control", "Draft Control", "Control Type",
  "Remote Valve Type", "Number of Remote Valves", "Three Point Linkage",
  "Linkage Category", "Top Link", "Draft Sensitivity",
  "External Hydraulic Cylinder", "Self Levelling", "Quick Hitch",
  "Down Position Control", "Load Sensing", "Flow Control", "Return To Depth", "Transport Lock",
  // Pricing
  "Ex-Showroom Price", "On-Road Price", "Currency", "GST (%)",
  "TCS Applicable", "TCS (%)", "Finance Available", "EMI Available",
  "Down Payment", "Offer Price", "Negotiable", "Exchange Offer",
  // Location
  "Country", "State", "District", "Taluka", "City", "Pincode", "Landmark", "Full Address",
];

const SAMPLE_DATA: Record<string, any> = {
  // Basic (names DB master data se exactly match hone chahiye)
   "Category": "Tractors",
  "Brand": "Eicher",
  "Model": "EICHER 551",
  "Model Year": "2024",
  "Variant": "EICHER 551 SUPER",
  "Product Name": "Eicher 551 Super Tractor",
  "Product Code": "EICHER551-2026",
  "SKU Code": "ECH-551-SUPER-26",
  "Launch Year": "2026",
  "Tractor Status": "Available",
  "Drive Type": "2WD",
  "Short Description": "Eicher 551 49 HP tractor with powerful diesel engine and modern agricultural features.",
  "Highlight 1": "49 HP Powerful Engine",
  "Highlight 2": "3 Cylinder Diesel Engine",
  "Highlight 3": "2100 kg Hydraulic Lift",
  "Highlight 4": "Power Steering",
  "Highlight 5": "Oil Immersed Brakes",
  "Red": "Yes",
  "Blue": "Yes",
  "Green": "No",
  "Orange": "No",
  "Black": "Yes",
  "White": "Yes",
  "Custom Color": "Yes",
  "Custom Color Name": "Royal Blue",
  "Custom Color Code": "#1E40AF",
  "Upcoming": "No",
  "Available States": "Gujarat, Maharashtra, Rajasthan",
  "Available Districts": "Ahmedabad, Surat, Rajkot, Nashik",
  "Available Dealers": "Krushi Mall Dealer Network",
  "Stock Status": "In Stock",
  "SEO Title": "Eicher 551 Tractor Price, Features and Specifications",
  "SEO URL": "eicher-551-tractor",
  "Meta Description": "Buy Eicher 551 tractor with 49 HP engine, 3 cylinders, 3300 cc engine and powerful hydraulic lifting capacity.",
  "Keywords": "Eicher 551, Eicher tractor, 49 HP tractor, 2WD tractor, agricultural tractor",

  // Engine
  "Engine Type": "Diesel Engine",
  "Fuel Type": "Diesel",
  "Horse Power": 49,
  "Number of Cylinders": 3,
  "Cubic Capacity": 3300,
  "Rated RPM": 2000,
  "Aspirated Type": "Naturally Aspirated",
  "Emission Norms": "BS-VI",
  "Cooling System": "Water Cooled",
  "Air Filter Type": "Dry Type",
  "Maximum Torque": "210 Nm",
  "Torque RPM": "1400 RPM",
  "Torque Backup": "20%",
  "Engine Condition": "New",

  // Transmission
  "Clutch Type": "Dual Clutch",
  "Forward Gears": 8,
  "Reverse Gears": 2,
  "Gear Type": "Partial Constant Mesh",
  "Transmission Type": "Side Shift",
  "PTO HP": 42,
  "PTO RPM": 540,
  "PTO Type": "Live PTO",
  "PTO Position": "Rear",
  "Creeper Gears": "No",
  "Shuttle Shift": "No",
  "Side Shift Gear": "Yes",
  "Power Shuttle": "No",
  "Hi Lo Gears": "No",
  "Multi Speed PTO": "Yes",
  "Reverse PTO": "Yes",
  "Super Reducer": "No",

  // Hydraulic
  "Lifting Capacity": 2100,
  "Lifting Capacity At 610mm": 1800,
  "Hydraulic Type": "Open Centre Hydraulic",
  "ADDC": "Yes",
  "Position Control": "Yes",
  "Draft Control": "Yes",
  "Control Type": "Draft and Position Control",
  "Remote Valve Type": "Spool Valve",
  "Number of Remote Valves": 2,
  "Three Point Linkage": "Yes",
  "Linkage Category": "CAT-2",
  "Top Link": "Adjustable",
  "Draft Sensitivity": "Adjustable",
  "External Hydraulic Cylinder": "Yes",
  "Self Levelling": "No",
  "Quick Hitch": "Yes",
  "Down Position Control": "Yes",
  "Load Sensing": "No",
  "Flow Control": "Yes",
  "Return To Depth": "Yes",
  "Transport Lock": "Yes",

  // Pricing
  "Ex-Showroom Price": 750000,
  "On-Road Price": 875000,
  "Currency": "INR",
  "GST (%)": 12,
  "TCS Applicable": "No",
  "TCS (%)": 0,
  "Finance Available": "Yes",
  "EMI Available": "Yes",
  "Down Payment": 150000,
  "Offer Price": 725000,
  "Negotiable": "Yes",
  "Exchange Offer": "Yes",

  // Location
  "Country": "India",
  "State": "Gujarat",
  "District": "Ahmedabad",
  "Taluka": "Daskroi",
  "City": "Ahmedabad",
  "Pincode": "380001",
  "Landmark": "Krushi Mall Showroom",
  "Full Address": "Krushi Mall Showroom, Ahmedabad, Gujarat, India - 380001",
};
type Props = {
  open: boolean;
  onClose: () => void;
  onImported?: () => void;
};

export default function ImportWebsiteVariantsModal({ open, onClose, onImported }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!open) return null;

  const reset = () => {
    setFileName("");
    setRows([]);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    onClose();
  };

const downloadTemplate = async () => {
  try {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Products");

    ws.columns = TEMPLATE_HEADERS.map((h) => ({ header: h, width: 20 }));
    ws.addRow(TEMPLATE_HEADERS.map((h) => SAMPLE_DATA[h] ?? ""));
    ws.getRow(1).font = { bold: true };

    const buf = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "website-variant-import-template.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error(e);
    toast.error("Template download failed");
  }
};

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      toast.error("Please select an .xlsx, .xls or .csv file");
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: true });

      if (!json.length) {
        toast.error("No rows found in the file");
        return;
      }
      setFileName(file.name);
      setRows(json);
      setResult(null);
    } catch (err) {
      console.error(err);
      toast.error("Unable to read the file");
    }
  };

const handleImport = async () => {
  if (!rows.length) return;
  try {
    setLoading(true);

    const CHUNK = 100;
    const total = { created: 0, failed: 0, errors: [] as any[], ignoredColumns: [] as string[] };

    for (let start = 0; start < rows.length; start += CHUNK) {
      const chunk = rows.slice(start, start + CHUNK);
      const res: any = await apiHelper.post("/vendoradmin/website-variants/import", {
        rows: chunk,
      });
      const body = res?.data;
      const data = body?.data ?? body;

      total.created += data.created || 0;
      total.failed += data.failed || 0;
      // row number original Excel row ke hisaab se adjust karo
      (data.errors || []).forEach((er: any) =>
        total.errors.push({ row: er.row + start, message: er.message }),
      );
      total.ignoredColumns = Array.from(
        new Set([...total.ignoredColumns, ...(data.ignoredColumns || [])]),
      );
    }

    setResult(total);

    if (total.created > 0) {
      toast.success(`${total.created} products imported`);
      onImported?.();
    } else {
      toast.error("No products were imported");
    }
  } catch (err: any) {
    console.error(err);
    toast.error(err?.response?.data?.message || "Import failed");
  } finally {
    setLoading(false);
  }
};

  const previewHeaders = rows[0] ? Object.keys(rows[0]).slice(0, 6) : [];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 px-4">
      <div className="dark:bg-dark-800 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="dark:border-dark-600 flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Import Website Variants
          </h2>
          <button type="button" onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="size-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <button
            type="button"
            onClick={downloadTemplate}
            className="text-primary-600 flex items-center gap-2 text-sm font-medium hover:underline"
          >
            <ArrowDownTrayIcon className="size-4" />
            Download sample template
          </button>

          <label className="dark:border-dark-500 hover:border-primary-500 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-8 text-center">
            <ArrowUpTrayIcon className="size-8 text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {fileName ? `${fileName} (${rows.length} rows)` : "Select an Excel / CSV file"}
            </span>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFile}
              className="hidden"
            />
          </label>

          {rows.length > 0 && !result && (
            <div className="dark:border-dark-600 overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left text-xs">
                <thead className="dark:bg-dark-700 bg-gray-50">
                  <tr>
                    {previewHeaders.map((h) => (
                      <th key={h} className="px-3 py-2 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 5).map((r, i) => (
                    <tr key={i} className="dark:border-dark-600 border-t border-gray-100">
                      {previewHeaders.map((h) => (
                        <td key={h} className="px-3 py-2 text-gray-600 dark:text-gray-300">
                          {String(r[h])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-3 py-2 text-xs text-gray-500">Preview: first 5 rows</p>
            </div>
          )}

          {result && (
            <div className="dark:bg-dark-700 space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-transparent">
              <p className="font-semibold">
                {result.created} imported, {result.failed} failed
              </p>

              {result.ignoredColumns?.length > 0 && (
                <p className="text-amber-600">
                  These columns were skipped:{" "}
                  <span className="font-medium">{result.ignoredColumns.join(", ")}</span>
                </p>
              )}

              {result.errors?.length > 0 && (
                <ul className="max-h-40 list-disc space-y-1 overflow-auto pl-5 text-red-600">
                  {result.errors.map((er: any, i: number) => (
                    <li key={i}>
                      Row {er.row}: {er.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="dark:border-dark-600 flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <Button variant="outlined" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="primary"
            onClick={handleImport}
            disabled={!rows.length || loading || !!result}
          >
            {loading ? "Importing..." : "Import"}
          </Button>
        </div>
      </div>
    </div>
  );
}