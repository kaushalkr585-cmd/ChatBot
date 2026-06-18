import React from 'react';
import { Code2, GraduationCap, Palette } from 'lucide-react';

const suggestions = [
  {
    title: 'Build a React App',
    prompt: 'Build a React app idea with a clean component structure and implementation steps.',
    icon: Code2,
    accent: 'bg-blue-500',
  },
  {
    title: 'Explain Machine Learning',
    prompt: 'Explain machine learning in simple terms with a practical example.',
    icon: GraduationCap,
    accent: 'bg-green',
  },
  {
    title: 'Create Portfolio Ideas',
    prompt: 'Create unique portfolio project ideas for a modern software developer.',
    icon: Palette,
    accent: 'bg-red',
  },
];

const SuggestionCards = ({ onSuggestionClick }) => {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-3">
      {suggestions.map(({ title, prompt, icon: Icon, accent }) => (
        <button
          key={title}
          onClick={() => onSuggestionClick(prompt)}
          className="brutal-press flex min-h-[118px] flex-col justify-between rounded-[16px] border-[3px] border-[var(--border)] bg-[var(--surface)] p-4 text-left shadow-brutal transition-all duration-200 hover:bg-yellow hover:text-black"
        >
          <span className={`flex h-11 w-11 items-center justify-center rounded-xl border-[3px] border-[var(--border)] ${accent}`}>
            <Icon className="h-5 w-5" strokeWidth={3} />
          </span>
          <span className="mt-4 text-lg font-extrabold leading-tight">{title}</span>
        </button>
      ))}
    </div>
  );
};

export default SuggestionCards;
