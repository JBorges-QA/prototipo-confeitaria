"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Check, Plus, Trash2 } from "lucide-react";
import { getDataSource } from "@/data";
import { useCategories } from "@/data/hooks";
import type { Category } from "@/domain/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Sheet } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/toast";

export function CategoriesManager({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast();
  const { data: categories } = useCategories();
  const [newName, setNewName] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const ds = getDataSource();

  async function save(c: Category) {
    const name = drafts[c.id]?.trim();
    if (!name || name === c.name) return;
    await ds.catalog.saveCategory({ ...c, name });
    setDrafts((d) => {
      const next = { ...d };
      delete next[c.id];
      return next;
    });
    toast("Categoria atualizada");
  }

  async function move(c: Category, dir: -1 | 1) {
    if (!categories) return;
    const idx = categories.findIndex((x) => x.id === c.id);
    const other = categories[idx + dir];
    if (!other) return;
    await ds.catalog.saveCategory({ ...c, sortOrder: other.sortOrder });
    await ds.catalog.saveCategory({ ...other, sortOrder: c.sortOrder });
  }

  async function remove(c: Category) {
    if (!confirm(`Excluir a categoria “${c.name}”?`)) return;
    try {
      await ds.catalog.deleteCategory(c.id);
      toast("Categoria excluída");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Erro", "error");
    }
  }

  async function add() {
    if (newName.trim().length < 2) return;
    const max = Math.max(0, ...(categories ?? []).map((c) => c.sortOrder));
    await ds.catalog.saveCategory({ name: newName.trim(), sortOrder: max + 1 });
    setNewName("");
    toast("Categoria criada");
  }

  return (
    <Sheet open={open} onClose={onClose} title="Categorias do cardápio">
      <div className="space-y-2 px-5 pb-6">
        <p className="mb-3 text-sm text-cocoa-500">A ordem aqui é a mesma exibida no cardápio do site.</p>
        {(categories ?? []).map((c, i) => (
          <div key={c.id} className="flex items-center gap-1.5 rounded-xl border border-cocoa-900/10 bg-white p-1.5">
            <Input
              className="h-9 border-0 focus:ring-0"
              value={drafts[c.id] ?? c.name}
              onChange={(e) => setDrafts((d) => ({ ...d, [c.id]: e.target.value }))}
              onBlur={() => save(c)}
              onKeyDown={(e) => e.key === "Enter" && save(c)}
            />
            {drafts[c.id] && drafts[c.id] !== c.name && (
              <button onClick={() => save(c)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sage-500 hover:bg-sage-100" aria-label="Salvar">
                <Check className="h-4 w-4" />
              </button>
            )}
            <button disabled={i === 0} onClick={() => move(c, -1)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-cocoa-400 hover:bg-cocoa-900/5 disabled:opacity-30" aria-label="Subir">
              <ArrowUp className="h-4 w-4" />
            </button>
            <button disabled={i === (categories?.length ?? 0) - 1} onClick={() => move(c, 1)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-cocoa-400 hover:bg-cocoa-900/5 disabled:opacity-30" aria-label="Descer">
              <ArrowDown className="h-4 w-4" />
            </button>
            <button onClick={() => remove(c)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-cocoa-400 hover:bg-red-50 hover:text-red-600" aria-label="Excluir">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <div className="flex gap-2 pt-3">
          <Input placeholder="Nova categoria" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
          <Button onClick={add} disabled={newName.trim().length < 2}>
            <Plus className="h-4 w-4" /> Adicionar
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
