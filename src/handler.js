const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const newNote = {
    id,
    title,
    tags,
    body,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      success: true,
      message: 'Note added successfully',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    success: 'fail',
    message: 'Add note failed',
  });
  response.code(500);
  return response;
};

const getAllNoteHandler = () => ({
  status: 'success',
  data: { notes },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    const response = {
      status: 'success',
      data: { note },
    };
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Note not found',
  });
  response.code(404);
  return response;
};

const editNoteHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      success: true,
      message: 'Note updated successfully',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    success: 'fail',
    message: 'Update note failed, id not found',
  });
  response.code(404);
  return response;
};

const deleteNoteHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);

    const response = h.response({
      success: true,
      message: 'Note deleted successfully',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    success: 'fail',
    message: 'Delete note failed, id not found',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNoteHandler,
  getNoteByIdHandler,
  editNoteHandler,
  deleteNoteHandler,
};
