"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface Field {
  name: string;
  type: "text" | "number" | "textarea" | "select";
  labelPT: string;
  labelES: string;
  options?: string[];
  rows?: number;
  hasNao?: boolean;
  small?: boolean;
}

interface FormData {
  [key: string]: string | number;
}

interface CheckboxesData {
  [key: string]: boolean;
}

type Lang = "pt" | "es";

interface FormSectionProps {
  lang: Lang;
  theme: "light" | "dark";
}

const fields: Field[] = [
  { name: "sessionId", type: "text", labelPT: "Session ID", labelES: "Session ID", hasNao: true, small: true },
  { name: "tecnicoLocal", type: "select", labelPT: "Técnico está no local", labelES: "El técnico está en el sitio", small: true, options: ["Sim", "Não", "Balcão"] },
  { name: "nomeTecnico", type: "text", labelPT: "Nome do Técnico", labelES: "Nombre del Técnico" },
  { name: "prestadora", type: "select", labelPT: "Prestadora", labelES: "Proveedora", options: ["UNY", "Proxxi", "SIC"], small: true },
  { name: "techId", type: "number", labelPT: "Tech ID", labelES: "ID Técnico", small: true },
  { name: "numeroChamado", type: "number", labelPT: "Nº do Chamado (DPS)", labelES: "N° del Ticket (DPS)", small: true },
  { name: "caso", type: "text", labelPT: "Caso", labelES: "Caso", small: true },
  { name: "serviceTag", type: "text", labelPT: "Service Tag", labelES: "Service Tag", small: true },
  { name: "modelo", type: "text", labelPT: "Modelo", labelES: "Modelo", small: true },
  { name: "falhaInicial", type: "text", labelPT: "Falha Inicial", labelES: "Fallo inicial" },
  { name: "pecasTrocadas", type: "textarea", labelPT: "Peças Trocadas", labelES: "Piezas Reemplazadas", rows: 3, hasNao: true },
  { name: "versaoBios", type: "text", labelPT: "Versão BIOS", labelES: "Versión BIOS", hasNao: true, small: true },
  { name: "epsaError", type: "text", labelPT: "Error Code", labelES: "Error Code" },
  { name: "epsaValidation", type: "text", labelPT: "Validation Code", labelES: "Validation Code" },
  { name: "reportAtual", type: "textarea", labelPT: "Report Atual", labelES: "Informe Actual", rows: 4 },
  { name: "anexos", type: "textarea", labelPT: "Anexos enviado pelo técnico", labelES: "Archivos adjuntos enviados por el técnico", rows: 3, hasNao: true },
  { name: "ppidDoa", type: "text", labelPT: "PPID DOA", labelES: "PPID DOA", hasNao: true },
  { name: "novoChamado", type: "number", labelPT: "Nº Novo Chamado (DPS)", labelES: "Nº Nuevo Ticket (DPS)", hasNao: true },
  { name: "endereco", type: "textarea", labelPT: "Endereço", labelES: "Dirección", rows: 3, hasNao: true },
  { name: "instructions", type: "textarea", labelPT: "Instructions", labelES: "Instrucciones", rows: 6, hasNao: true },
];

const initialInstructions = {
  pt: `- Sr(a) Técnico(a), por gentileza, substituir:
- Realizar ePSA e validar a funcionalidade de equipamento.
- Atualize BIOS e Drivers conforme Processo Global Dell.
- Ao final anexe os PPID's do(s) componente(s).
- Caso persista ou tenha falha adicional, reportar diretamente para DSPQ`,
  es: `- Sr(a) Técnico(a), por favor sustituya:
- Realizar ePSA y validar la funcionalidad del equipo.
- Actualizar BIOS y Drivers según el Proceso Global Dell.
- Al final adjuntar los PPID del(los) componente(s).
- Si persiste o hay alguna falla adicional, reportar directamente a DSPQ`,
};

export default function FormSection({ lang, theme }: FormSectionProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [checkboxes, setCheckboxes] = useState<CheckboxesData>({});
  const [showResumo, setShowResumo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [historico, setHistorico] = useState<{ form: FormData; checks: CheckboxesData }[]>([]);

  const t = {
    pt: { naoSeAplica: "Não se aplica", selecione: "Selecione...", gerarLog: "Gerar Log", limparFormulario: "🧹 Limpar Formulário", copiar: "📋 Copiar", copiado: "✅ Copiado!", historicoTitulo: "Histórico de Logs (máx. 10)" },
    es: { naoSeAplica: "No se aplica", selecione: "Seleccione...", gerarLog: "Generar Registro", limparFormulario: "🧹 Borrar Formulario", copiar: "📋 Copiar", copiado: "✅ ¡Copiado!", historicoTitulo: "Historial de Registros (máx. 10)" },
  }[lang];

  const inputClass = `w-full rounded-lg p-2 border focus:ring-2 focus:ring-blue-500 focus:outline-none
  disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed
  dark:disabled:bg-gray-600 dark:disabled:text-gray-400
  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
  bg-gray-50 border-gray-300 text-gray-900`;


  useEffect(() => {
    const initForm: FormData = {};
    const initChecks: CheckboxesData = { epsaNao: false };
    fields.forEach(f => {
      initForm[f.name] = f.name === "instructions" ? initialInstructions[lang] : "";
      if (f.hasNao) initChecks[f.name + "Nao"] = false;
    });
    setFormData(initForm);
    setCheckboxes(initChecks);

    const savedHistorico = localStorage.getItem("historico");
    if (savedHistorico) setHistorico(JSON.parse(savedHistorico));
  }, []);

  useEffect(() => {
    localStorage.setItem("historico", JSON.stringify(historico));
  }, [historico]);


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target;
    if (type === "checkbox") {
      setCheckboxes(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowResumo(true);
    setHistorico(prev => [{ form: formData, checks: checkboxes }, ...prev].slice(0, 10));
  };

  const handleCopy = async (item: { form: FormData; checks: CheckboxesData }) => {
    let texto = "";
    fields.forEach(f => {
      const naoKey = f.name + "Nao";
      if (f.hasNao && item.checks[naoKey]) return;
      if (f.name === "epsaError") texto += item.checks.epsaNao ? "" : `EPSA - Error Code: ${item.form.epsaError}\nEPSA - Validation Code: ${item.form.epsaValidation}\n`;
      else if (f.name === "epsaValidation") return;
      else texto += `${lang === "pt" ? f.labelPT : f.labelES}: ${item.form[f.name]}\n`;
    });
    await navigator.clipboard.writeText(texto.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const limparFormulario = () => {
    const cleared: FormData = {};
    fields.forEach(f => {
      cleared[f.name] = f.name === "instructions" ? initialInstructions[lang] : "";
    });
    const clearedChecks: CheckboxesData = { epsaNao: false };
    fields.forEach(f => {
      if (f.hasNao) clearedChecks[f.name + "Nao"] = false;
    });
    setFormData(cleared);
    setCheckboxes(clearedChecks);
    setShowResumo(false);
  };

  const limparHistorico = () => {
    localStorage.removeItem("historico");
    setHistorico([]);
  };

  return (
    <div className={`max-w-5xl mx-auto p-6 rounded-2xl mt-8 border shadow-md transition-colors 
      ${theme === "dark" ? "bg-gray-900 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-900"}`}>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(f => {
          if (f.name === "epsaError") {
            return (
              <div key="epsa" className="sm:col-span-2 border rounded-lg p-3">
                <label className="font-medium mb-2 block">EPSA</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block font-medium mb-1">Error Code</label>
                    <input
                      type="text"
                      name="epsaError"
                      value={String(formData.epsaError || "")}
                      onChange={handleChange}
                      className={inputClass}
                      disabled={checkboxes.epsaNao}
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Validation Code</label>
                    <input
                      type="text"
                      name="epsaValidation"
                      value={String(formData.epsaValidation || "")}
                      onChange={handleChange}
                      className={inputClass}
                      disabled={checkboxes.epsaNao}
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    name="epsaNao"
                    checked={checkboxes.epsaNao || false}
                    onChange={handleChange}
                  />
                  {t.naoSeAplica}
                </label>
              </div>
            );
          }

          const naoKey = f.name + "Nao";
          const span = f.type === "textarea" ? "sm:col-span-2" : f.small ? "" : "sm:col-span-2";

          return (
            <div key={f.name} className={span}>
              <label className="block font-medium mb-1">{lang === "pt" ? f.labelPT : f.labelES}</label>
              {f.type === "textarea" ? (
                <textarea
                  name={f.name}
                  value={String(formData[f.name] || "")}
                  onChange={handleChange}
                  className={inputClass}
                  rows={f.rows || 3}
                  disabled={f.hasNao && checkboxes[naoKey]}
                />
              ) : f.type === "select" ? (
                <select
                  name={f.name}
                  value={String(formData[f.name] || "")}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">{t.selecione}</option>
                  {f.options?.map(o => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type}
                  name={f.name}
                  value={String(formData[f.name] || "")}
                  onChange={handleChange}
                  className={inputClass}
                  disabled={f.hasNao && checkboxes[naoKey]}
                />
              )}
              {f.hasNao && (
                <input
                  type="checkbox"
                  name={naoKey}
                  checked={checkboxes[naoKey] || false}
                  onChange={handleChange}
                />

              )}
            </div>
          );
        })}

        {/* Botões */}
        <div className="flex gap-2 sm:col-span-2 mt-2">
          <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            {t.gerarLog}
          </button>
          <button type="button" onClick={limparFormulario} className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors">
            {t.limparFormulario}
          </button>
        </div>
      </form>

      {/* Resumo */}
      {showResumo && (
        <div className={`mt-8 rounded-xl p-4 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">{t.historicoTitulo}</h3>
            <button onClick={() => handleCopy({ form: formData, checks: checkboxes })} type="button"
              className={`text-sm px-3 py-1 rounded-md font-medium border transition-colors duration-200 ${copied ? "bg-green-600 text-white border-green-600" : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"}`}>
              {copied ? t.copiado : t.copiar}
            </button>
          </div>
          <pre className="text-sm whitespace-pre-wrap">
            {fields.map(f => {
              const naoKey = f.name + "Nao";
              if (f.hasNao && checkboxes[naoKey]) return null;
              if (f.name === "epsaError") return checkboxes.epsaNao ? null : `EPSA - Error Code: ${formData.epsaError}\nEPSA - Validation Code: ${formData.epsaValidation}\n`;
              if (f.name === "epsaValidation") return null;
              return `${lang === "pt" ? f.labelPT : f.labelES}: ${formData[f.name]}\n`;
            })}
          </pre>
        </div>
      )}

      {historico.length > 0 && (
        <div className={`mt-8 rounded-xl p-4 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">{t.historicoTitulo}</h3>
            <button onClick={limparHistorico} className="text-sm text-red-600 hover:underline">🗑️ Reset</button>
          </div>
          {historico.map((item, idx) => (
            <details key={idx} className="mb-2 p-2 border rounded-md">
              <summary className="cursor-pointer font-medium flex justify-between items-center">
                <span>{item.form.nomeTecnico} — {item.form.numeroChamado} / {item.form.serviceTag}</span>
                <button type="button" className="ml-2 text-sm px-2 py-1 rounded-md font-medium border bg-blue-600 text-white hover:bg-blue-700"
                  onClick={async (e) => { e.stopPropagation(); await handleCopy(item); }}>
                  {t.copiar}
                </button>
              </summary>
              <pre className="text-sm whitespace-pre-wrap mt-1">
                {fields.map(f => {
                  const naoKey = f.name + "Nao";
                  if (f.hasNao && item.checks[naoKey]) return null;
                  if (f.name === "epsaError") return item.checks.epsaNao ? null : `EPSA - Error Code: ${item.form.epsaError}\nEPSA - Validation Code: ${item.form.epsaValidation}\n`;
                  if (f.name === "epsaValidation") return null;
                  return `${lang === "pt" ? f.labelPT : f.labelES}: ${item.form[f.name]}\n`;
                })}
              </pre>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
