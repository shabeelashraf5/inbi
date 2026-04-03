'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Check, Loader2, X, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface ExtractedItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  specs: string;
}

export function RFQParser({ onParsed }: { onParsed: (items: ExtractedItem[]) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      simulateParsing();
    }, 1500);
  };

  const simulateParsing = () => {
    setIsParsing(true);
    setTimeout(() => {
      const mockExtracted: ExtractedItem[] = [
        { id: '1', name: 'Industrial Steel Beam - H Section', quantity: 50, unit: 'pcs', specs: 'Grade 50, 12m length' },
        { id: '2', name: 'High-Tensile Bolts & Nuts', quantity: 500, unit: 'sets', specs: 'M24 x 150mm, Zinc plated' },
        { id: '3', name: 'Welding Electrodes - E7018', quantity: 200, unit: 'kg', specs: '3.2mm diameter' },
      ];
      setExtractedItems(mockExtracted);
      setIsParsing(false);
    }, 3000);
  };

  const handleAddItem = () => {
    const newItem: ExtractedItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      quantity: 1,
      unit: 'pcs',
      specs: '',
    };
    setExtractedItems([...extractedItems, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setExtractedItems(extractedItems.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof ExtractedItem, value: string | number) => {
    setExtractedItems(extractedItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleConfirm = () => {
    onParsed(extractedItems);
  };

  if (isParsing || isUploading) {
    return (
      <Card className="border-dashed border-2 bg-muted/30">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {isUploading ? 'Uploading Document...' : 'AI is extracting your RFQ items...'}
          </h3>
          <p className="text-muted-foreground text-sm max-w-xs text-center">
            {isUploading 
              ? 'Securing your connection to the document engine.' 
              : 'Our AI is extracting product names, quantities, and specifications from your PDF.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!file) {
    return (
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="group relative cursor-pointer border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 rounded-xl p-12 transition-all duration-300 bg-card hover:bg-primary/[0.02]"
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".pdf,.doc,.docx"
        />
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Upload className="text-primary w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Upload Client RFQ</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            Drag and drop your client&apos;s request PDF here, or click to browse. Our AI will automatically extract the product list for you.
          </p>
          <div className="flex items-center gap-2 text-sm text-primary font-medium bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
            <FileText size={16} />
            Supported: PDF, DOCX (Max 10MB)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/[0.01]">
        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
              <Check className="text-emerald-600" size={20} />
            </div>
            <div>
              <CardTitle className="text-lg">AI Extraction Complete</CardTitle>
              <p className="text-xs text-muted-foreground font-medium">Verify the line items for Item Review</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
            <X size={16} className="mr-1" /> Remove
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[30%]">Product Name</TableHead>
                <TableHead className="w-[40%]">Specifications</TableHead>
                <TableHead className="w-[10%]">Qty</TableHead>
                <TableHead className="w-[10%]">Unit</TableHead>
                <TableHead className="w-[10%]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {extractedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input 
                      value={item.name} 
                      onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                      placeholder="e.g. Steel Pipe"
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={item.specs} 
                      onChange={(e) => handleUpdateItem(item.id, 'specs', e.target.value)}
                      placeholder="e.g. 10mm thickness"
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      value={item.quantity} 
                      onChange={(e) => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value))}
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={item.unit} 
                      onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-rose-500"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-4 border-t bg-muted/10 flex justify-between">
            <Button variant="outline" size="sm" onClick={handleAddItem}>
              <Plus size={14} className="mr-1" /> Add Item
            </Button>
            <Button size="sm" onClick={handleConfirm}>
              Proceed to Procurement Decision
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
