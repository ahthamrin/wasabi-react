'''
preprocess data
1. read lines of JSON
2. sort by timestamp
3. filter by cmd and user
4. save as csv

'''

import argparse, json, csv, types, re, codecs, cStringIO


class UnicodeWriter:
    """
    A CSV writer which will write rows to CSV file "f",
    which is encoded in the given encoding.
    """

    def __init__(self, f, dialect=csv.excel, encoding="utf-8", **kwds):
        # Redirect output to a queue
        self.queue = cStringIO.StringIO()
        self.writer = csv.writer(self.queue, dialect=dialect, **kwds)
        self.stream = f
        self.encoder = codecs.getincrementalencoder(encoding)()

    def writerow(self, row):
      this_row = []
      for s in row:
        if type(s) == types.StringTypes:
          s = s.encode('utf-8')
        this_row.append(s)

        self.writer.writerow(this_row)
        #self.writer.writerow([s.encode("utf-8") for s in row])
        # Fetch UTF-8 output from the queue ...
        data = self.queue.getvalue()
        data = data.decode("utf-8")
        # ... and reencode it into the target encoding
        data = self.encoder.encode(data)
        # write to the target stream
        self.stream.write(data)
        # empty queue
        self.queue.truncate(0)

    def writerows(self, rows):
        for row in rows:
            self.writerow(row)

parser = argparse.ArgumentParser()
parser.add_argument('filename', help='mongoexport json output file')
args = parser.parse_args()

filename = args.filename

with open(filename) as f:
  data_list = map(json.loads, f.readlines())
print 'data_list len', len(data_list)

data_list = sorted(data_list, cmp=lambda x,y: x['timestamp']['$date'] - y['timestamp']['$date'])

#split by cmd type
data_cmd = {}

for d in data_list:
  cmd_type = d['cmd']
  if not cmd_type in data_cmd:
    data_cmd[cmd_type] = []

  if 'msg' in d:
    d['msg']['timestamp'] = d['timestamp']['$date']
    d.pop('timestamp', None)
    d.pop('_id', None)
    if not 'user' in d['msg'] and d['user']:
      d['msg']['user'] = d['user']
  data_cmd[cmd_type].append(d)

#split by username
data_cmd.pop('login', None) #never mind about the login data
data_cmd.pop('subSlide/null', None) #never mind about the login data
data_cmd.pop('subSlide/101', None) #never mind about the login data
data_cmd.pop('subSlide/102', None) #never mind about the login data
data_cmd.pop('subSlide/103', None) #never mind about the login data
data_cmd.pop('subSlide/104', None) #never mind about the login data
data_cmd.pop('subSlide/105', None) #never mind about the login data

data_cmd_username = {}

for k in data_cmd.keys():
  data_cmd_username[k] = {}

# data_cmd keys
#face-count | AskQuestion | subSlide/null | subSlide/101 | slideUpdate/101 | slideUpdate/undefined | login | AlertTeacher'

# face-count {u'msg': {'timestamp': 1457844403720, u'user': {u'username': u'dave', u'role': u'student'}, u'jpg': 8211, u'faces': [{u'y': 61, u'x': 111, u'height': 111, u'width': 111}]}, u'cmd': u'face-count', u'user': {u'username': u'dave', u'role': u'student'}}
# this is for face-count
# convert into a list for CSV
# timestamp, username, facecount, width, height, x, y ...


for d in data_cmd['face-count']:
  # format: timestamp, username, facecount, width, height, x, y ...

  if type(d['msg']['user']) is types.DictType:
    try:
      entry = [ d['cmd'], d['msg']['timestamp'], d['msg']['user']['username'] ]
    except:
      d['msg']['user'] = {'username': 'none'}
      entry = [ d['cmd'], d['msg']['timestamp'], 'none' ]

    face_list = sorted(d['msg']['faces'], cmp=lambda a,b: b['height']-a['height'])
    entry.append(len(face_list))

    face_keys = ['width','height', 'x','y']
    for f in face_list:
      for k in face_keys:
        entry.append(f[k])
  else:
    print 'error user', d

  username = d['msg']['user']['username']
  if not username in data_cmd_username['face-count']:
    data_cmd_username['face-count'][username] = []
  data_cmd_username['face-count'][username].append(entry)

for username, value in data_cmd_username['face-count'].iteritems():
  with open(username+'-face.csv', 'wb') as csvfile:
    this_write = csv.writer(csvfile, delimiter=',', dialect='excel')
    for d in value:
      this_write.writerow(d)

#AskQuestion {u'msg': {'timestamp': 1457844540749, u'questionMsg': u'it is started sir :)', u'sender': u'erin', 'user': {u'username': u'erin', u'role': u'student'}}, u'cmd': u'AskQuestion', u'user': {u'username': u'erin', u'role': u'student'}}
for d in data_cmd['AskQuestion']:
  # format: timestamp, username, questionLen, question
  if not 'user' in d['msg']:
    d['msg']['user'] = {'username': 'none'}

  if type(d['msg']['user']) is types.DictType:
    try:
      entry = [ d['cmd'], d['msg']['timestamp'], d['msg']['user']['username'] ]
    except:
      d['msg']['user'] = {'username': 'none'}
      entry = [ d['cmd'], d['msg']['timestamp'], 'none' ]
  else:
    print 'error user', d
  entry = entry + [len(d['msg']['questionMsg']), re.sub('\n',' ',d['msg']['questionMsg'])]

  username = d['msg']['user']['username']
  if not username in data_cmd_username['AskQuestion']:
    data_cmd_username['AskQuestion'][username] = []
  data_cmd_username['AskQuestion'][username].append(entry)

for username, value in data_cmd_username['AskQuestion'].iteritems():
  with codecs.open(username+'-AskQuestion.csv', 'w', 'utf-8') as csvfile:
    this_write = csv.writer(csvfile, delimiter=',', dialect='excel')
    #this_write = UnicodeWriter(csvfile)
    for d in value:
      this_row = []
      for s in d:
        if type(s) == types.StringTypes:
          s = s.encode('utf-8', 'ignore')
        this_row.append(s)
      try:
        this_write.writerow(this_row)
      except:
        print 'error csv', this_row

#AlertTeacher {u'msg': {'timestamp': 1457844751007, u'user': u'bob'}, u'cmd': u'AlertTeacher', u'user': {u'username': u'bob', u'role': u'student'}}
for d in data_cmd['AlertTeacher']:
  # format: timestamp, username, 1
  # 1 means there was an alert (the value must be 1)

  if not 'user' in d['msg']:
    d['msg']['user'] = 'none'

  try:
    entry = [ d['cmd'], d['msg']['timestamp'], d['msg']['user'], 1 ]
  except:
    d['msg']['user'] = {'username': 'none'}
    entry = [ d['cmd'], d['msg']['timestamp'], 'none' ]

  username = d['msg']['user']
  if not username in data_cmd_username['AlertTeacher']:
    data_cmd_username['AlertTeacher'][username] = []
  data_cmd_username['AlertTeacher'][username].append(entry)

for username, value in data_cmd_username['AlertTeacher'].iteritems():
  with open(username+'-AlertTeacher.csv', 'wb') as csvfile:
    this_write = csv.writer(csvfile, delimiter=',', dialect='excel')
    for d in value:
      this_write.writerow(d)


#slideUpdate/101 {u'msg': {'timestamp': 1457844366261, u'slideDeckId': u'101', 'user': {u'username': u'alice', u'role': u'lecturer'}, u'slideNoLocal': 1}, u'cmd': u'slideUpdate/101', u'user': {u'username': u'alice', u'role': u'lecturer'}}
#slideUpdate/undefined {u'msg': {'timestamp': 1457844665400, u'slideDeckId': u'101', u'slideNoLocal': 3}, u'cmd': u'slideUpdate/undefined', u'user': None}
# have to handle these two situations: with and without slide number
slideUpdateList = []
for k,v in data_cmd.iteritems():
  if k[:11] == 'slideUpdate':
    slideUpdateList = slideUpdateList + v

data_cmd_username['slideUpdate'] = {}

for d in slideUpdateList:
  # format: timestamp, username, slideDeckNo, SlideNo

  if not 'user' in d['msg']:
    d['msg']['user'] = {'username': 'none'}
  entry = [ d['cmd'], d['msg']['timestamp'], d['msg']['user']['username'], d['msg']['slideDeckId'], d['msg']['slideNoLocal'] ]

  username = d['msg']['user']['username']
  if not username in data_cmd_username['slideUpdate']:
    data_cmd_username['slideUpdate'][username] = []
  data_cmd_username['slideUpdate'][username].append(entry)

for username, value in data_cmd_username['slideUpdate'].iteritems():
  with open(username+'-slideUpdate.csv', 'wb') as csvfile:
    this_write = csv.writer(csvfile, delimiter=',', dialect='excel')
    for d in value:
      this_write.writerow(d)




