export function html(newNote: {
  newNoteComplaint: string;
  newNoteSubjective: string;
  newNoteObjective: string;
  newNoteAssessment: string;
  newNotePlan: string;
  currentMedications: string[];
  allergies: string[];
  orders: string[];
}): string {
  const { newNoteComplaint, newNoteSubjective, newNoteObjective, newNoteAssessment, newNotePlan, currentMedications, allergies, orders } = newNote;

  let noteHTML = '<h3>Chief Complaint</h3>';
  if (newNoteComplaint !== null && newNoteComplaint.length > 0) {
    noteHTML += `<div>${newNoteComplaint.replace(/(\r\n|\n|\r)/g, '<br/>')}</div>`;
  } else {
    noteHTML += '<div>None Specified</div>';
  }
  noteHTML += '<h3>Subjective</h3>';
  if (newNoteSubjective !== null && newNoteSubjective.length > 0) {
    noteHTML += `<div>${newNoteSubjective.replace(/(\r\n|\n|\r)/g, '<br/>')}</div>`;
  } else {
    noteHTML += '<div>None Specified</div>';
  }
  noteHTML += '<h3>Objective</h3>';
  if (newNoteObjective !== null && newNoteObjective.length > 0) {
    noteHTML += `<div>${newNoteObjective.replace(/(\r\n|\n|\r)/g, '<br/>')}</div>`;
  } else {
    noteHTML += '<div>None Specified</div>';
  }
  noteHTML += '<h3>Assessment</h3>';
  if (newNoteAssessment !== null && newNoteAssessment.length > 0) {
    noteHTML += `<div>${newNoteAssessment.replace(/(\r\n|\n|\r)/g, '<br/>')}</div>`;
  } else {
    noteHTML += '<div>None Specified</div>';
  }
  noteHTML += '<h3>Plan</h3>';
  if (newNotePlan !== null && newNotePlan.length > 0) {
    noteHTML += `<div>${newNotePlan.replace(/(\r\n|\n|\r)/g, '<br/>')}</div>`;
  } else {
    noteHTML += '<div>None Specified</div>';
  }
  if (currentMedications !== null) {
    noteHTML += '<h3>Current Medications</h3>';
    if (currentMedications.length > 0) {
      noteHTML += '<div>';
      currentMedications.forEach((prescription) => {
        noteHTML += `${prescription}<br/>`;
      });
      noteHTML += '</div>';
    } else {
      noteHTML += '<div>No Current Medications</div>';
    }
  }
  if (allergies !== null) {
    noteHTML += '<h3>Allergies</h3>';
    if (allergies.length > 0) {
      noteHTML += '<div>';
      allergies.forEach((allergy) => {
        noteHTML += `${allergy}<br/>`;
      });
      noteHTML += '</div>';
    } else {
      noteHTML += '<div>No Allergies</div>';
    }
  }
  if (orders !== null) {
    noteHTML += '<h3>Orders</h3>';
    if (orders.length > 0) {
      noteHTML += '<div>';
      orders.forEach((order) => {
        noteHTML += `${order}<br/>`;
      });
      noteHTML += '</div>';
    } else {
      noteHTML += '<div>No Orders</div>';
    }
  }
  return noteHTML;
}

export function highlightWordFilter(input, searchTerm) {
  if (searchTerm && input && input.length !== 0) {
    const pattern = new RegExp(searchTerm, 'gi');
    return !!input.match(pattern)?.length;
  }
  return false;
}
