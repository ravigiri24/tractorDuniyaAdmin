import {AngularEditorConfig} from '@kolkov/angular-editor';

export class RichTextUtil {

  public static editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '100px',
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'undo',
        'redo',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
      ],
      ['link', 'unlink', 'insertImage', 'insertVideo', 'insertHorizontalRule'],
    ],
  };
}
