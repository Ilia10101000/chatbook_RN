import React, {useEffect, useState} from 'react'

function useErrorAlert() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);
  return { error, setError };
}

export { useErrorAlert };