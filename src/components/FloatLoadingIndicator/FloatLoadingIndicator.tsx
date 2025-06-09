import Spinner from 'react-bootstrap/Spinner'
import { FormattedMessage } from 'react-intl'

const FloatLoadingIndicator = () => {
  const styles = {
    borderRadius: '0.475rem',
    boxShadow: '0 0 50px 0 rgb(82 63 105 / 15%)',
    color: '#7e8299',
    fontWeight: '500',
    margin: '0',
    width: 'auto',
    padding: '1rem 2rem',
    top: 'calc(50% - 2rem)',
    left: 'calc(50% - 4rem)',
  }

  return (
    <div
      ref={(ref) => {
        ref?.parentElement?.classList.add('position-relative')
      }}
      className="bg-body d-flex align-items-center"
      style={{ ...styles, position: 'absolute', textAlign: 'center' }}
    >
      <FormattedMessage id="vocabulary.loading" />
      ...
      <Spinner
        animation="border"
        variant="primary"
        style={{ width: '1.5rem', height: '1.5rem', marginLeft: 10 }}
      />
    </div>
  )
}

export default FloatLoadingIndicator
