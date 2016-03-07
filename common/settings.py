import sublime

settings = sublime.load_settings('ncop.sublime-settings')
# TODO: auto
token = None
pub_token = None


def assign_settings():
    global token
    token = settings.get('token')

    global project_sign
    project_sign = settings.get('project_sign')

assign_settings()
settings.add_on_change('token', assign_settings)
