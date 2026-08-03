import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="fade-in" style={{ padding: '120px 40px', textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>
      <div className="num" style={{ fontSize: 14, color: 'var(--dim)', letterSpacing: '0.1em', marginBottom: 12, fontWeight: 500 }}>
        404
      </div>
      <h1 style={{ margin: '0 0 12px', fontSize: 28, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.025em' }}>
        Такой страницы нет
      </h1>
      <p style={{ margin: '0 0 28px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
        Возможно, ссылка устарела или адрес введён с ошибкой.
      </p>
      <Button variant="primary" onClick={() => navigate('/dashboard')}>
        На главную
      </Button>
    </div>
  );
}
