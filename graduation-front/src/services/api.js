export const getMessage = async () => {
    const response = await fetch('/api/message');
    if (!response.ok) {
      throw new Error('Failed to fetch message from backend');
    }
    return response.text();
  };
  