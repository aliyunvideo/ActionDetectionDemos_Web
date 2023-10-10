interface ProgressProps {
  value: number;
}

function Progress({ value }: ProgressProps) {
  const width = (value * 100).toFixed(2) + '%';

  return (
    <div className='progress'>
      <div className='_inner' style={{ width }}>
        <span className='_text'>{width}</span>
      </div>
    </div>
  );
}

export default Progress;
