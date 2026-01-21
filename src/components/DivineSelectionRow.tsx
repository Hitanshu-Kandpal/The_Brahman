import { useNavigate } from 'react-router-dom';
import type { GodConfig } from '../App';

interface DivineSelectionRowProps {
  gods: GodConfig[];
}

export function DivineSelectionRow({ gods }: DivineSelectionRowProps) {
  const navigate = useNavigate();

  return (
    <section className="divine-selection-row">
      <div className="divine-selection-container">
        <div className="divine-avatars-constellation">
          {gods.map((god) => (
            <button
              key={god.id}
              className="divine-avatar-bubble"
              onClick={() => navigate(`/god/${god.id}`)}
              title={god.name}
              aria-label={`Select ${god.name}`}
            >
              <img
                src={god.avatarSrc}
                alt={god.name}
                className="divine-avatar-bubble-img"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
