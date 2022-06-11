import sqlite3


def delete_from():
    conn = sqlite3.connect('test.db')
    c = conn.cursor()

    # delete all rows from table
    c.execute('DELETE FROM key;', )

    print('We have deleted', c.rowcount, 'records from the table.')

    # commit the changes to db
    conn.commit()
    # close the connection
    conn.close()


def drop_table():
    # Connecting to sqlite
    conn = sqlite3.connect('test.db')

    # Creating a cursor object using the cursor() method
    cursor = conn.cursor()

    # Doping EMPLOYEE table if already exists
    cursor.execute("DROP TABLE key")
    print("Table dropped... ")

    # Commit your changes in the database
    conn.commit()

    # Closing the connection
    conn.close()

drop_table()
