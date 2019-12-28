import React, { useContext, useRef, useEffect } from 'react';
import ContactContext from '../../context/contact/contactContext';

const ContactFilter = () => {
  const contactContext = useContext(ContactContext);
  const text = useRef('');
  // we are using a ref instead of state for the filtering of form input
  const { filterContacts, clearFilter, filtered } = contactContext;

  // set form values back to null
  useEffect(() => {
    if (filtered === null) {
      text.current.value = '';
    }
  })

  const onChange = e => {
    if (text.current.value !== '') {
      filterContacts(e.target.value);
    } else {
      clearFilter();
    }
  }

  return (
    <form>
      <input ref={text} type="text" placeholder="Filter Contacts..." onChange={onChange} />
    </form>
  )
}

export default ContactFilter
